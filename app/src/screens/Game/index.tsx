import { useRoute } from "@react-navigation/native";
import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GameParams } from "../../@types/navigation";
import { Background } from "../../components/Background";

import { styles } from "./styles";

export function Game() {
  const route = useRoute();
  const {} = route.params as GameParams;

  return (
    <Background>
      <SafeAreaView style={styles.container}>
        <View style={styles.container}></View>
      </SafeAreaView>
    </Background>
  );
}