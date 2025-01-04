import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

const OthersLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="editProfile"
          options={{
            headerShown: true,
            title: "修改個人資料",
          }}
        />
      </Stack>

      <StatusBar backgroundColor="#FFFFFF" style="dark" />
    </>
  );
};

export default OthersLayout;
