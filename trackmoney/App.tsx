import * as React from "react";
import { ActivityIndicator, Platform, Text, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

const Stack = createNativeStackNavigator();

import { SQLiteProvider, openDatabaseAsync } from "expo-sqlite";
import Home from "./screens/Home";

const loadDatabase = async () => {
  const db = await openDatabaseAsync("mySqLiteDb.db");
};

export default function App() {
  const [dbLoaded, setDbLoaded] = React.useState<boolean>(false);

  React.useEffect(() => {
    loadDatabase()
      .then(() => setDbLoaded(true))
      .catch((e) => console.error(e));
  }, []);

  return (
    <NavigationContainer>
      <React.Suspense
        fallback={
          <View style={{ flex: 1 }}>
            <ActivityIndicator size={"large"} />
            <Text>데이터베이스 로딩중...</Text>
          </View>
        }
      >
        <SQLiteProvider
          databaseName="mySQLiteDB.db"
          assetSource={{ assetId: require("./assets/mySQLiteDB.db") }}
          useSuspense
        >
          <Stack.Navigator>
            <Stack.Screen
              name="Home"
              component={Home}
              options={{
                headerTitle: "가계부",
                headerLargeTitle: true,
                headerTransparent: Platform.OS === "ios" ? true : false,
                headerBlurEffect: "light",
              }}
            />
          </Stack.Navigator>
        </SQLiteProvider>
      </React.Suspense>
    </NavigationContainer>
  );
}
