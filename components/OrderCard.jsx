import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

const OrderCard = ({ oid, delivery_fee, delivery_address, created_at }) => {
  const router = useRouter();
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("zh-TW");
  };

  return (
    <TouchableOpacity
      onPress={() => router.push(`/order/${oid}`)}
      className="bg-white rounded-xl shadow-md mb-4 overflow-hidden w-11/12 mx-auto p-4"
    >
      <View className="flex-row justify-between mb-2">
        <Text className="text-lg font-bold">訂單編號: {oid}</Text>
        <Text className="text-green-600 font-bold">NT$ {delivery_fee}</Text>
      </View>
      <Text className="text-gray-500 text-sm mt-1">
        {delivery_address && `外送地址: ${delivery_address} \n`}
        下單時間: {formatDate(created_at)}
      </Text>
    </TouchableOpacity>
  );
};

export default OrderCard;
