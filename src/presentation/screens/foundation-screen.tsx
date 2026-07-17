import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, spacing } from '@/presentation/theme/tokens';

export function FoundationScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.content}>
        <Text style={styles.eyebrow}>Tria foundation</Text>
        <Text style={styles.title}>Ready for Day 0.</Text>
        <Text style={styles.body}>
          Product decisions come first. The architecture is ready to receive the MVP
          without accumulating throwaway code.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  eyebrow: {
    color: colors.tide,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 2.4,
    textTransform: 'uppercase',
  },
  title: {
    marginTop: spacing.md,
    color: colors.ink,
    fontSize: 46,
    fontWeight: '800',
    letterSpacing: -1.5,
    lineHeight: 52,
  },
  body: {
    maxWidth: 360,
    marginTop: spacing.lg,
    color: colors.inkMuted,
    fontSize: 16,
    lineHeight: 24,
  },
});
