import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { tabScreenStyles } from "../styles/tabs.styles";

export default function MenuTab() {
  return (
    <SafeAreaView style={tabScreenStyles.container}>
      <Text style={tabScreenStyles.title}>Menu</Text>
    </SafeAreaView>
  );
}
