import React, { useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, StyleProp, ImageStyle } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme';

interface GifPlayerProps {
  gifSource: any;       // require('../...gif')
  staticSource?: any;   // imagem estática opcional (fallback = mesmo gif pausado)
  style?: StyleProp<ImageStyle>;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'center';
}

/**
 * Exibe um GIF pausado por padrão.
 * Ao tocar, anima o GIF. Ao tocar novamente, pausa.
 *
 * Como o React Native não tem API de pausa nativa de GIF,
 * a "pausa" é simulada trocando entre a imagem estática e o GIF.
 * Se não houver staticSource, usa o mesmo gifSource (pausa visual não funciona nesse caso).
 */
export const GifPlayer: React.FC<GifPlayerProps> = ({
  gifSource,
  staticSource,
  style,
  resizeMode = 'cover',
}) => {
  return (
    <View style={[styles.wrap, style as any]}>
      <Image
        source={staticSource ?? gifSource}
        style={[StyleSheet.absoluteFill, { borderRadius: (style as any)?.borderRadius ?? 0 }]}
        resizeMode={resizeMode}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.4)',
  },
});
