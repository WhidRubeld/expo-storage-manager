import { useCallback, useEffect } from 'react'
import {
  StyleProp,
  View,
  StyleSheet,
  Pressable,
  ImageStyle,
  Image
} from 'react-native'
import { CacheEntryStatus } from './CacheEntry.class'
import { useCacheFile } from './hooks'
import { DownloadIcon, PauseIcon } from './icons'
import ProgressIndicator from './ProgressIndicator'

export type CachingImageProps = {
  manager: string
  uri: string
  style?: StyleProp<ImageStyle>
}
export default function CachingImage({
  manager,
  uri,
  style
}: CachingImageProps) {
  const { status, path, progress, downloadAsync, pauseAsync, resumeAsync } =
    useCacheFile(uri, manager)

  const processingHalder = useCallback(() => {
    switch (status) {
      case CacheEntryStatus.Pending: {
        downloadAsync()
        break
      }
      case CacheEntryStatus.Progress: {
        pauseAsync()
        break
      }
      case CacheEntryStatus.Pause: {
        resumeAsync()
        break
      }
    }
  }, [status, downloadAsync, pauseAsync, resumeAsync])

  useEffect(() => {
    processingHalder()
  }, [])

  return (
    <View style={{ position: 'relative', backgroundColor: '#ccc' }}>
      {path ? (
        <Image source={{ uri: path }} style={style} />
      ) : (
        <View style={style} />
      )}
      <Pressable onPress={processingHalder} style={StyleSheet.absoluteFill}>
        <ProgressIndicator
          progress={progress}
          width={3}
          size={36}
          color='#ffffff'
          style={{
            marginLeft: 'auto',
            marginRight: 'auto',
            marginTop: 'auto',
            marginBottom: 'auto',
            padding: 15,
            backgroundColor: '#000'
          }}
        >
          {CacheEntryStatus.Progress === status ? (
            <PauseIcon width={16} height={16} fill='#ffffff' />
          ) : (
            <DownloadIcon width={24} height={24} fill='#ffffff' />
          )}
        </ProgressIndicator>
      </Pressable>
    </View>
  )
}