import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, spacing } from '@/presentation/theme/tokens';

type RoutePlaceholderScreenProps = Readonly<{
  eyebrow: string;
  title: string;
}>;

export function RoutePlaceholderScreen({
  eyebrow,
  title,
}: RoutePlaceholderScreenProps) {
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.content}>
        <Text style={styles.eyebrow}>{eyebrow}</Text>
        <Text style={styles.title}>{title}</Text>
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
    maxWidth: 360,
    marginTop: spacing.md,
    color: colors.ink,
    fontSize: 40,
    fontWeight: '800',
    lineHeight: 46,
  },
});
