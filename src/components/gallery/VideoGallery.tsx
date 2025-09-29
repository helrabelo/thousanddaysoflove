'use client'

import { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, Volume2, VolumeX, Maximize, Clock, Eye, Heart, Share2 } from 'lucide-react'
import { MediaItem } from '@/types/wedding'

interface VideoGalleryProps {
  videos: MediaItem[]
  title?: string
  description?: string
  layout?: 'grid' | 'featured' | 'carousel'
  autoPlay?: boolean
  showDuration?: boolean
  onVideoClick?: (video: MediaItem, index: number) => void
}

interface VideoPlayerState {
  videoId: string | null
  isPlaying: boolean
  isMuted: boolean
  currentTime: number
  duration: number
  isFullscreen: boolean
}

export default function VideoGallery({
  videos,
  title = "Nossos Momentos em Vídeo",
  description = "Reviva os momentos mais especiais da nossa jornada",
  layout = 'grid',
  autoPlay = false,
  showDuration = true,
  onVideoClick
}: VideoGalleryProps) {
  const [playerState, setPlayerState] = useState<VideoPlayerState>({
    videoId: null,
    isPlaying: false,
    isMuted: true,
    currentTime: 0,
    duration: 0,
    isFullscreen: false
  })
  const [selectedVideo, setSelectedVideo] = useState<MediaItem | null>(null)
  const [likedVideos, setLikedVideos] = useState<Set<string>>(new Set())
  const [viewCounts, setViewCounts] = useState<Map<string, number>>(new Map())

  // Filter only video items
  const videoItems = useMemo(() => {
    return videos.filter(item => item.media_type === 'video' && item.is_public)
  }, [videos])

  const formatDuration = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }, [])

  const handleVideoClick = useCallback((video: MediaItem, index: number) => {
    setSelectedVideo(video)
    setViewCounts(prev => {
      const newMap = new Map(prev)
      newMap.set(video.id, (newMap.get(video.id) || 0) + 1)
      return newMap
    })

    if (onVideoClick) {
      onVideoClick(video, index)
    }
  }, [onVideoClick])

  const togglePlay = useCallback((videoId: string, videoElement?: HTMLVideoElement) => {
    if (!videoElement) {
      videoElement = document.getElementById(`video-${videoId}`) as HTMLVideoElement
    }

    if (videoElement) {
      if (playerState.isPlaying && playerState.videoId === videoId) {
        videoElement.pause()
        setPlayerState(prev => ({ ...prev, isPlaying: false }))
      } else {
        // Pause all other videos
        document.querySelectorAll('video').forEach(v => {
          if (v.id !== `video-${videoId}`) v.pause()
        })

        videoElement.play()
        setPlayerState(prev => ({
          ...prev,
          videoId,
          isPlaying: true
        }))
      }
    }
  }, [playerState])

  const toggleMute = useCallback((videoId: string) => {
    const videoElement = document.getElementById(`video-${videoId}`) as HTMLVideoElement
    if (videoElement) {
      videoElement.muted = !playerState.isMuted
      setPlayerState(prev => ({ ...prev, isMuted: !prev.isMuted }))
    }
  }, [playerState.isMuted])

  const toggleLike = useCallback((videoId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setLikedVideos(prev => {
      const newSet = new Set(prev)
      if (newSet.has(videoId)) {
        newSet.delete(videoId)
      } else {
        newSet.add(videoId)
      }
      return newSet
    })
  }, [])

  const shareVideo = useCallback((video: MediaItem, e: React.MouseEvent) => {
    e.stopPropagation()
    if (navigator.share) {
      navigator.share({
        title: video.title,
        text: video.description || 'Confira este momento especial!',
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }, [])

  const renderGridLayout = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {videoItems.map((video, index) => (
        <motion.div
          key={video.id}
          className="group cursor-pointer"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          viewport={{ once: true }}
          onClick={() => handleVideoClick(video, index)}
        >
          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 bg-black">
            {/* Video Element */}
            <video
              id={`video-${video.id}`}
              className="w-full h-full object-cover"
              poster={video.thumbnail_url}
              preload="metadata"
              onLoadedMetadata={(e) => {
                const videoEl = e.target as HTMLVideoElement
                setPlayerState(prev => ({
                  ...prev,
                  duration: videoEl.duration
                }))
              }}
              onTimeUpdate={(e) => {
                const videoEl = e.target as HTMLVideoElement
                setPlayerState(prev => ({
                  ...prev,
                  currentTime: videoEl.currentTime
                }))
              }}
              onPlay={() => setPlayerState(prev => ({ ...prev, isPlaying: true, videoId: video.id }))}
              onPause={() => setPlayerState(prev => ({ ...prev, isPlaying: false }))}
            >
              <source src={video.url} type="video/mp4" />
            </video>

            {/* Play Overlay */}
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-all duration-300">
              <motion.button
                className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center backdrop-blur-sm shadow-lg"
                onClick={(e) => {
                  e.stopPropagation()
                  togglePlay(video.id)
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {playerState.isPlaying && playerState.videoId === video.id ? (
                  <Pause className="w-10 h-10 text-rose-600" />
                ) : (
                  <Play className="w-10 h-10 text-rose-600 ml-1" />
                )}
              </motion.button>
            </div>

            {/* Duration Badge */}
            {showDuration && video.metadata && (
              <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                <Clock className="w-4 h-4 inline mr-1" />
                {formatDuration(Number(video.metadata.duration) || 0)}
              </div>
            )}

            {/* Action Buttons */}
            <div className="absolute bottom-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <button
                onClick={(e) => toggleLike(video.id, e)}
                className={`p-2 rounded-full backdrop-blur-md border border-white/20 transition-all duration-300 ${
                  likedVideos.has(video.id)
                    ? 'bg-rose-500 text-white'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <Heart className={`w-4 h-4 ${likedVideos.has(video.id) ? 'fill-current' : ''}`} />
              </button>

              <button
                onClick={(e) => shareVideo(video, e)}
                className="p-2 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all duration-300 border border-white/20"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  toggleMute(video.id)
                }}
                className="p-2 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all duration-300 border border-white/20"
              >
                {playerState.isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Video Progress Bar */}
            {playerState.videoId === video.id && playerState.isPlaying && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
                <div
                  className="h-full bg-gradient-to-r from-rose-500 to-pink-600 transition-all duration-300"
                  style={{
                    width: `${(playerState.currentTime / playerState.duration) * 100}%`
                  }}
                />
              </div>
            )}

            {/* View Count */}
            {viewCounts.has(video.id) && (
              <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                <Eye className="w-4 h-4 inline mr-1" />
                {viewCounts.get(video.id)}
              </div>
            )}
          </div>

          {/* Video Info */}
          <div className="mt-4">
            <h3 className="font-bold text-lg text-deep-romantic mb-2 line-clamp-2">
              {video.title}
            </h3>

            {video.description && (
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {video.description}
              </p>
            )}

            {/* Tags */}
            {video.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {video.tags.slice(0, 3).map(tag => (
                  <span
                    key={tag}
                    className="bg-rose-100 text-rose-700 px-2 py-1 rounded-full text-xs font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Date and Location */}
            <div className="flex justify-between items-center text-sm text-gray-500">
              {video.date_taken && (
                <span>
                  {new Date(video.date_taken).toLocaleDateString('pt-BR')}
                </span>
              )}
              {video.location && (
                <span className="truncate ml-2">{video.location}</span>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )

  const renderFeaturedLayout = () => {
    const featuredVideo = videoItems.find(v => v.is_featured) || videoItems[0]
    const otherVideos = videoItems.filter(v => v.id !== featuredVideo?.id).slice(0, 4)

    if (!featuredVideo) return null

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Featured Video */}
        <div className="lg:col-span-2">
          <motion.div
            className="aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black cursor-pointer group"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            onClick={() => handleVideoClick(featuredVideo, 0)}
          >
            <video
              id={`video-${featuredVideo.id}`}
              className="w-full h-full object-cover"
              poster={featuredVideo.thumbnail_url}
              preload="metadata"
            >
              <source src={featuredVideo.url} type="video/mp4" />
            </video>

            {/* Play Overlay */}
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-all duration-300">
              <motion.button
                className="w-24 h-24 bg-white/90 rounded-full flex items-center justify-center backdrop-blur-sm shadow-lg"
                onClick={(e) => {
                  e.stopPropagation()
                  togglePlay(featuredVideo.id)
                }}
                whileHover={{ scale: 1.1 }}
              >
                <Play className="w-12 h-12 text-rose-600 ml-1" />
              </motion.button>
            </div>

            {/* Featured Badge */}
            <div className="absolute top-6 left-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
              ⭐ Destaque
            </div>
          </motion.div>

          <div className="mt-6">
            <h3 className="text-2xl font-bold text-deep-romantic mb-3">
              {featuredVideo.title}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {featuredVideo.description}
            </p>
          </div>
        </div>

        {/* Other Videos */}
        <div className="space-y-4">
          {otherVideos.map((video, index) => (
            <motion.div
              key={video.id}
              className="flex space-x-4 cursor-pointer group"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              onClick={() => handleVideoClick(video, index + 1)}
            >
              <div className="relative w-32 h-20 rounded-lg overflow-hidden bg-black flex-shrink-0">
                <img
                  src={video.thumbnail_url}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <Play className="w-6 h-6 text-white" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-deep-romantic mb-1 line-clamp-2">
                  {video.title}
                </h4>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {video.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-rose-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="section-header text-deep-romantic mb-6">
            <span className="bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
              {title}
            </span>
          </h2>
          <p className="story-text text-gray-700 max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>
          <div className="mt-6 flex justify-center space-x-4 text-sm text-gray-600">
            <span className="flex items-center">
              <Play className="w-4 h-4 mr-1" />
              {videoItems.length} vídeos
            </span>
            <span className="flex items-center">
              <Heart className="w-4 h-4 mr-1" />
              {likedVideos.size} curtidas
            </span>
          </div>
        </motion.div>

        {/* Video Gallery */}
        {layout === 'featured' ? renderFeaturedLayout() : renderGridLayout()}

        {/* Full Screen Video Modal */}
        <AnimatePresence>
          {selectedVideo && (
            <motion.div
              className="fixed inset-0 bg-black/90 flex items-center justify-center p-6 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedVideo(null)}
            >
              <motion.div
                className="relative max-w-6xl w-full"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <video
                  controls
                  autoPlay
                  className="w-full aspect-video rounded-2xl"
                  poster={selectedVideo.thumbnail_url}
                >
                  <source src={selectedVideo.url} type="video/mp4" />
                </video>

                <button
                  onClick={() => setSelectedVideo(null)}
                  className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <div className="mt-6 text-white text-center">
                  <h3 className="text-2xl font-bold mb-2">{selectedVideo.title}</h3>
                  {selectedVideo.description && (
                    <p className="text-gray-300">{selectedVideo.description}</p>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {videoItems.length === 0 && (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-6xl mb-4">🎬</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Nenhum vídeo encontrado
            </h3>
            <p className="text-gray-500">
              Os vídeos da nossa história de amor aparecerão aqui em breve!
            </p>
          </motion.div>
        )}
      </div>
    </section>
  )
}