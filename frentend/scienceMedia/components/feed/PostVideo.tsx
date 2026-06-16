import { useVideoPlayer, VideoView } from 'expo-video';
import type { StyleProp, ViewStyle } from 'react-native';

export function PostVideo({ uri, style }: { uri: string; style?: StyleProp<ViewStyle> }) {
  const player = useVideoPlayer(uri, (p) => {
    p.loop = false;
  });

  return (
    <VideoView
      style={style}
      player={player}
      nativeControls
      allowsFullscreen
      contentFit="cover"
    />
  );
}

// AOUAD ABDELKARIM
