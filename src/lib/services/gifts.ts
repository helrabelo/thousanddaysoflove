// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/lib/supabase/client'
import { createAdminClient } from '@/lib/supabase/server'
import { Gift } from '@/types/wedding'
import { client as sanityClient } from '@/sanity/lib/client'

// Sanity Gift Item type (from CMS)
export interface SanityGiftItem {
  _id: string
  title: string
  description: string
  fullPrice: number
  imageUrl?: string
  category: string
  allowPartialPayment: boolean
  suggestedContributions?: number[]
  allowCustomAmount: boolean
  priority: 'high' | 'medium' | 'low'
  isActive: boolean
  storeUrl?: string
  notes?: string
}

// Gift with contribution progress
export interface GiftWithProgress extends SanityGiftItem {
  totalContributed: number
  percentFunded: number
  contributors: Array<{
    payment_id: string
    guest_id?: string
    amount: number
    payment_date: string
    payment_method: string
    message?: string
    status: string
  }>
  contributionCount: number
  remainingAmount: number
  isFullyFunded: boolean
}

export class GiftService {
  // ========================================
  // NEW: Sanity CMS Gift Registry Methods
  // ========================================

  /**
   * Fetch a single gift from Sanity CMS by its _id
   * @param sanityGiftId - The Sanity document _id (e.g., "giftItem-abc123")
   * @returns SanityGiftItem or null if not found
   */
  static async getGiftFromSanity(sanityGiftId: string): Promise<SanityGiftItem | null> {
    try {
      const query = `
        *[_type == "giftItem" && _id == $sanityGiftId][0] {
          _id,
          title,
          description,
          fullPrice,
          "imageUrl": image.asset->url,
          category,
          allowPartialPayment,
          suggestedContributions,
          allowCustomAmount,
          priority,
          isActive,
          storeUrl,
          notes
        }
      `

      const gift = await sanityClient.fetch<SanityGiftItem | null>(query, { sanityGiftId })
      return gift
    } catch (error) {
      console.error('Error fetching gift from Sanity:', error)
      return null
    }
  }

  /**
   * Get contribution progress for a specific gift from Supabase
   * Uses the gift_contributions view created in migration 020
   * @param sanityGiftId - The Sanity document _id
   * @returns Contribution summary with total, count, and contributors
   */
  static async getGiftContributions(sanityGiftId: string) {
    try {
      const supabase = createClient()

      // Query the gift_contributions view
      const { data, error } = await supabase
        .from('gift_contributions')
        .select('*')
        .eq('sanity_gift_id', sanityGiftId)
        .single()

      if (error) {
        // No contributions yet for this gift
        if (error.code === 'PGRST116') {
          return {
            totalContributed: 0,
            contributionCount: 0,
            contributors: []
          }
        }
        console.error('Error fetching gift contributions:', error)
        return {
          totalContributed: 0,
          contributionCount: 0,
          contributors: []
        }
      }

      return {
        totalContributed: parseFloat(data.total_contributed || '0'),
        contributionCount: parseInt(data.contribution_count || '0'),
        contributors: data.contributors || []
      }
    } catch (error) {
      console.error('Error in getGiftContributions:', error)
      return {
        totalContributed: 0,
        contributionCount: 0,
        contributors: []
      }
    }
  }

  /**
   * Get all active gifts from Sanity with contribution progress from Supabase
   * Combines Sanity CMS content with real-time payment data
   * @returns Array of gifts with contribution progress
   */
  static async getAllGiftsWithProgress(): Promise<GiftWithProgress[]> {
    try {
      // Fetch all active gifts from Sanity
      const query = `
        *[_type == "giftItem" && isActive == true] | order(priority asc, fullPrice desc) {
          _id,
          title,
          description,
          fullPrice,
          "imageUrl": image.asset->url,
          category,
          allowPartialPayment,
          suggestedContributions,
          allowCustomAmount,
          priority,
          isActive,
          storeUrl,
          notes
        }
      `

      const sanityGifts = await sanityClient.fetch<SanityGiftItem[]>(query)

      // Fetch contribution progress for each gift
      const giftsWithProgress = await Promise.all(
        sanityGifts.map(async (gift) => {
          const contributions = await this.getGiftContributions(gift._id)

          const remainingAmount = gift.fullPrice - contributions.totalContributed
          const percentFunded = (contributions.totalContributed / gift.fullPrice) * 100
          const isFullyFunded = contributions.totalContributed >= gift.fullPrice

          return {
            ...gift,
            totalContributed: contributions.totalContributed,
            contributionCount: contributions.contributionCount,
            contributors: contributions.contributors,
            remainingAmount: Math.max(0, remainingAmount),
            percentFunded: Math.min(100, percentFunded),
            isFullyFunded
          }
        })
      )

      return giftsWithProgress
    } catch (error) {
      console.error('Error fetching gifts with progress:', error)
      return []
    }
  }

  /**
   * Get gifts filtered by category with contribution progress
   * @param category - Gift category (e.g., 'kitchen', 'honeymoon')
   * @returns Array of gifts in that category with progress
   */
  static async getGiftsByCategoryWithProgress(category: string): Promise<GiftWithProgress[]> {
    try {
      const query = `
        *[_type == "giftItem" && isActive == true && category == $category] | order(priority asc, fullPrice desc) {
          _id,
          title,
          description,
          fullPrice,
          "imageUrl": image.asset->url,
          category,
          allowPartialPayment,
          suggestedContributions,
          allowCustomAmount,
          priority,
          isActive,
          storeUrl,
          notes
        }
      `

      const sanityGifts = await sanityClient.fetch<SanityGiftItem[]>(query, { category })

      const giftsWithProgress = await Promise.all(
        sanityGifts.map(async (gift) => {
          const contributions = await this.getGiftContributions(gift._id)

          const remainingAmount = gift.fullPrice - contributions.totalContributed
          const percentFunded = (contributions.totalContributed / gift.fullPrice) * 100
          const isFullyFunded = contributions.totalContributed >= gift.fullPrice

          return {
            ...gift,
            totalContributed: contributions.totalContributed,
            contributionCount: contributions.contributionCount,
            contributors: contributions.contributors,
            remainingAmount: Math.max(0, remainingAmount),
            percentFunded: Math.min(100, percentFunded),
            isFullyFunded
          }
        })
      )

      return giftsWithProgress
    } catch (error) {
      console.error('Error fetching gifts by category:', error)
      return []
    }
  }

  // ========================================
  // LEGACY: Supabase Gift Registry Methods
  // (Will be deprecated after migration)
  // ========================================

  // Public gift registry functions
  static async getAllGifts(): Promise<Gift[]> {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('gifts')
      .select('*')
      .eq('is_available', true)
      .order('priority', { ascending: false })
      .order('price', { ascending: true })

    if (error || !data) return []
    return data
  }

  static async getGiftsByCategory(category: string): Promise<Gift[]> {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('gifts')
      .select('*')
      .eq('category', category)
      .eq('is_available', true)
      .order('priority', { ascending: false })
      .order('price', { ascending: true })

    if (error || !data) return []
    return data
  }

  static async getGiftById(id: string): Promise<Gift | null> {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('gifts')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) return null
    return data
  }

  static async getGiftCategories(): Promise<string[]> {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('gifts')
      .select('category')
      .eq('is_available', true)

    if (error || !data) return []

    const categories = [...new Set(data.map((item: Gift) => item.category))]
    return categories.sort()
  }

  // Check if gift is available for purchase
  static async isGiftAvailable(giftId: string): Promise<boolean> {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('gifts')
      .select('quantity_desired, quantity_purchased, is_available')
      .eq('id', giftId)
      .single()

    if (error || !data) return false

    type GiftAvailability = { is_available: boolean; quantity_purchased: number; quantity_desired: number }
    const giftData = data as GiftAvailability
    return giftData.is_available && giftData.quantity_purchased < giftData.quantity_desired
  }

  // Get gift availability details
  static async getGiftAvailability(giftId: string) {
    const supabase = createClient()

    // RPC function not yet created in database
    // Will use direct query instead
    const { data, error } = await supabase
      .from('gifts')
      .select('*')
      .eq('id', giftId)
      .single()

    if (error || !data) return null

    const giftData = data as Gift
    return {
      available: giftData.is_available && giftData.quantity_purchased < giftData.quantity_desired,
      quantity_remaining: Math.max(0, giftData.quantity_desired - giftData.quantity_purchased),
      quantity_desired: giftData.quantity_desired,
      quantity_purchased: giftData.quantity_purchased,
      price: giftData.price,
      is_active: giftData.is_available
    }
  }

  // Reserve a gift (temporarily reduce available quantity)
  static async reserveGift(giftId: string, quantity: number = 1): Promise<boolean> {
    const supabase = createClient()

    // Check availability first
    const isAvailable = await this.isGiftAvailable(giftId)
    if (!isAvailable) return false

    // First get current quantity
    const { data: currentGift, error: fetchError } = await supabase
      .from('gifts')
      .select('quantity_purchased')
      .eq('id', giftId)
      .single()

    if (fetchError || !currentGift) return false

    // Update with new quantity
    const newQuantity = (currentGift as Gift).quantity_purchased + quantity
    const updateData: Partial<Gift> = {
      quantity_purchased: newQuantity
    }
    const { data, error } = await (supabase
      .from('gifts')
      .update(updateData as never)
      .eq('id', giftId)
      .eq('is_available', true)
      .select())

    if (error) {
      console.error('Error reserving gift:', error)
      return false
    }

    return data && data.length > 0
  }

  // Admin functions (server-side only)
  static async createGift(giftData: Omit<Gift, 'id' | 'created_at' | 'updated_at'>): Promise<Gift | null> {
    try {
      const adminClient = createAdminClient()

      const { data, error } = await adminClient
        .from('gifts')
        .insert(giftData)
        .select()
        .single()

      if (error) {
        console.error('Error creating gift:', error)
        return null
      }

      return data as Gift as Gift
    } catch (error) {
      console.error('Error in createGift:', error)
      return null
    }
  }

  static async updateGift(id: string, updates: Partial<Gift>): Promise<Gift | null> {
    try {
      const adminClient = createAdminClient()

      const { data, error } = await adminClient
        .from('gifts')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error updating gift:', error)
        return null
      }

      return data as Gift
    } catch (error) {
      console.error('Error in updateGift:', error)
      return null
    }
  }

  static async deleteGift(id: string): Promise<boolean> {
    try {
      const adminClient = createAdminClient()

      const { error } = await adminClient
        .from('gifts')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting gift:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error in deleteGift:', error)
      return false
    }
  }

  // Get gift statistics for admin dashboard
  static async getGiftStats() {
    const supabase = createClient()

    const { data: stats, error } = await supabase
      .from('gift_stats')
      .select('*')

    if (error) {
      console.error('Error fetching gift stats:', error)
      return []
    }

    return stats || []
  }

  // Get popular gifts (most purchased)
  static async getPopularGifts(limit: number = 5): Promise<Gift[]> {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('gifts')
      .select('*')
      .gt('quantity_purchased', 0)
      .order('quantity_purchased', { ascending: false })
      .limit(limit)

    if (error || !data) return []
    return data
  }

  // Get recently added gifts
  static async getRecentGifts(limit: number = 5): Promise<Gift[]> {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('gifts')
      .select('*')
      .eq('is_available', true)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error || !data) return []
    return data
  }

  // Search gifts by name or description
  static async searchGifts(query: string): Promise<Gift[]> {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('gifts')
      .select('*')
      .eq('is_available', true)
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .order('priority', { ascending: false })

    if (error || !data) return []
    return data
  }

  // Filter gifts by price range
  static async getGiftsByPriceRange(minPrice: number, maxPrice: number): Promise<Gift[]> {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('gifts')
      .select('*')
      .eq('is_available', true)
      .gte('price', minPrice)
      .lte('price', maxPrice)
      .order('price', { ascending: true })

    if (error || !data) return []
    return data
  }

  // Get gift recommendations based on category and price
  static async getRecommendedGifts(category?: string, budget?: number, limit: number = 6): Promise<Gift[]> {
    const supabase = createClient()

    let query = supabase
      .from('gifts')
      .select('*')
      .eq('is_available', true)
      .gt('quantity_purchased', 0) // Only gifts that have been purchased (popular)

    if (category) {
      query = query.eq('category', category)
    }

    if (budget) {
      query = query.lte('price', budget)
    }

    const { data, error } = await query
      .order('quantity_purchased', { ascending: false })
      .order('priority', { ascending: false })
      .limit(limit)

    if (error || !data) return []
    return data
  }

  // Real-time subscriptions for gift changes
  // Commenting out due to TypeScript issues with postgres_changes type
  // static subscribeToGiftChanges(callback: (payload: { new: Gift; old: Gift; eventType: string }) => void) {
  //   const supabase = createClient()

  //   return supabase
  //     .channel('gifts_changes')
  //     .on(
  //       'postgres_changes' as any,
  //       {
  //         event: '*',
  //         schema: 'public',
  //         table: 'gifts',
  //       },
  //       callback
  //     )
  //     .subscribe()
  // }

  // Brazilian currency formatting
  static formatBrazilianPrice(price: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  // Calculate total registry value
  static async getRegistryTotalValue(): Promise<{ desired: number; purchased: number; remaining: number }> {
    const supabase = createClient()

    const { data: gifts, error } = await supabase
      .from('gifts')
      .select('price, quantity_desired, quantity_purchased')
      .eq('is_available', true)

    if (error || !gifts) {
      return { desired: 0, purchased: 0, remaining: 0 }
    }

    const totals = gifts.reduce((acc, gift: any) => {
      const desiredValue = gift.price * gift.quantity_desired
      const purchasedValue = gift.price * gift.quantity_purchased

      acc.desired += desiredValue
      acc.purchased += purchasedValue
      acc.remaining += (desiredValue - purchasedValue)

      return acc
    }, { desired: 0, purchased: 0, remaining: 0 })

    return totals
  }
}