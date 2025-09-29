import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.GOOGLE_MAPS_PLATFORM_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Google Maps API key not configured' },
        { status: 500 }
      )
    }

    // Return the API key securely for client-side Google Maps usage
    return NextResponse.json({
      apiKey: apiKey,
      language: 'pt-BR',
      region: 'BR'
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}