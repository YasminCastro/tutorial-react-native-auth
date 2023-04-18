import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext";
import Home from "../pages/Home";
import Login from "../pages/Login";
import { NavigationContainer } from "@react-navigation/native";
import { Button } from "react-native/Libraries/Components/Button";

const Stack = createNativeStackNavigator();

const Layout = () => {
  const { authState, onLogout } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {authState?.isAuth ? (
          <Stack.Screen
            name={"Home"}
            component={Home}
            options={{
              headerRight: () => <Button onPress={onLogout} title="Sign Out" />,
            }}
          />
        ) : (
          <Stack.Screen name={"Login"} component={Login} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Layout;
