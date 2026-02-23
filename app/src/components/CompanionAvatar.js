import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";

export default function CompanionAvatar({ speaking }) {
  const bob = useRef(new Animated.Value(0)).current;
  const mouth = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(bob, {
          toValue: -5,
          duration: 1400,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.quad),
        }),
        Animated.timing(bob, {
          toValue: 0,
          duration: 1400,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.quad),
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [bob]);

  useEffect(() => {
    let loop;
    if (speaking) {
      loop = Animated.loop(
        Animated.sequence([
          Animated.timing(mouth, {
            toValue: 0.95,
            duration: 180,
            useNativeDriver: false,
          }),
          Animated.timing(mouth, {
            toValue: 0.35,
            duration: 180,
            useNativeDriver: false,
          }),
        ])
      );
      loop.start();
    } else {
      Animated.timing(mouth, {
        toValue: 0.35,
        duration: 180,
        useNativeDriver: false,
      }).start();
    }
    return () => {
      if (loop) loop.stop();
    };
  }, [speaking, mouth]);

  const mouthHeight = mouth.interpolate({
    inputRange: [0, 1],
    outputRange: [6, 16],
  });

  return (
    <Animated.View style={[styles.wrap, { transform: [{ translateY: bob }] }]}>
      <View style={styles.halo} />
      <View style={styles.head}>
        <View style={styles.eyeRow}>
          <View style={styles.eye} />
          <View style={styles.eye} />
        </View>
        <Animated.View style={[styles.mouth, { height: mouthHeight }]} />
      </View>
      <View style={styles.body}>
        <View style={styles.badge}>
          <Text style={styles.badgeLabel}>Companion</Text>
        </View>
      </View>
      <View style={styles.shadow} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  halo: {
    position: "absolute",
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor: "#FDE7F0",
    top: 8,
  },
  head: {
    width: 132,
    height: 132,
    borderRadius: 66,
    backgroundColor: "#FFF7FC",
    borderWidth: 2,
    borderColor: "#F3D3E0",
    alignItems: "center",
    justifyContent: "center",
  },
  eyeRow: {
    width: 64,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  eye: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.textPrimary,
  },
  mouth: {
    width: 34,
    borderRadius: 10,
    backgroundColor: "#D97A99",
  },
  body: {
    marginTop: -8,
    width: 170,
    height: 98,
    borderTopLeftRadius: 44,
    borderTopRightRadius: 44,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    backgroundColor: "#EFFBF8",
    borderWidth: 2,
    borderColor: "#CAE9E0",
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E5D1CB",
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badgeLabel: {
    color: colors.textSecondary,
    fontWeight: "700",
    fontSize: 12,
  },
  shadow: {
    marginTop: 8,
    width: 150,
    height: 16,
    borderRadius: 8,
    backgroundColor: "rgba(151, 110, 131, 0.2)",
  },
});
