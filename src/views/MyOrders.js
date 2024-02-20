import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { bold, regular, api_url, vendor_order_list } from "../config/Constants";
import * as colors from "../assets/css/Colors";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { ScrollView } from "react-native-gesture-handler";
import CardView from "react-native-cardview";
import Loader from "../components/Loader";

const MyOrders = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [order_list, setOrderList] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      await get_order_list();
    });
    return unsubscribe;
  }, []);

  const get_order_list = async () => {
    setLoading(true);
    await axios({
      method: "post",
      url: api_url + vendor_order_list,
      data: { vendor_id: global.id },
    })
      .then(async (response) => {
        setLoading(false);
        setOrderList(response.data.result);
        console.log("order results", response.data.result);
      })
      .catch((error) => {
        setLoading(false);
        alert("Sorry something went wrong");
      });
  };

  const get_status_background = (slug) => {
    if (slug == "error") {
      return { backgroundColor: colors.error_background };
    } else if (slug == "warning") {
      return { backgroundColor: colors.warning_background };
    } else {
      return { backgroundColor: colors.success_background };
    }
  };

  const get_status_foreground = (slug) => {
    if (slug == "error") {
      return { color: colors.error };
    } else if (slug == "warning") {
      return { color: colors.warning };
    } else {
      return { color: colors.success };
    }
  };

  const show_products = (products) => {
    let list = JSON.parse(products);
    return list.map((data, i) => {
      if (i <= 1) {
        return (
          <View
            style={{ flexDirection: "row", marginTop: 10, marginBottom: 10 }}
          >
            <View style={{ width: "70%", alignItems: "flex-start" }}>
              <Text
                style={{
                  fontFamily: regular,
                  color: colors.grey,
                  fontSize: 17,
                }}
              >
                {data.product_name}
              </Text>
              <Text
                style={{
                  fontFamily: regular,
                  color: colors.grey,
                  fontSize: 12,
                }}
              >
                {data.unit} / x{data.qty}
              </Text>
            </View>
            <View style={{ width: "30%", alignItems: "flex-end" }}>
              <Text
                style={{
                  fontFamily: regular,
                  color: colors.grey,
                  fontSize: 17,
                }}
              >
                {global.currency}
                {data.price}
              </Text>
            </View>
          </View>
        );
      }
    });
  };

  const move_details = (data) => {
    navigation.navigate("MyOrderDetails", { data: data });
  };
  const render_list = ({ item }) => (
    <CardView
      cardElevation={4}
      style={{ margin: 10 }}
      cardMaxElevation={4}
      cornerRadius={10}
    >
      <TouchableOpacity
        onPress={move_details.bind(this, item.id)}
        style={{ padding: 20 }}
      >
        <View style={{ flexDirection: "row" }}>
          <View style={{ width: "50%", alignItems: "flex-start" }}>
            <Text
              style={{
                fontFamily: regular,
                color: colors.theme_fg_two,
                fontSize: 17,
              }}
            >
              {item.customer_name}
            </Text>
            <View style={{ margin: 2 }} />
            <Text
              style={{ fontFamily: regular, color: colors.grey, fontSize: 12 }}
            >
              {item.created_at}
            </Text>
          </View>
          <View style={{ width: "50%", alignItems: "flex-end" }}>
            <Text
              style={{
                fontFamily: regular,
                color: colors.theme_fg_two,
                fontSize: 17,
              }}
            >
              {global.currency}
              {item.total}
            </Text>
            <View style={{ margin: 2 }} />
            <Text
              style={{ fontFamily: regular, color: colors.grey, fontSize: 12 }}
            >
              #{item.id}
            </Text>
          </View>
        </View>
        <View style={{ margin: 10 }} />
        <View
          style={[
            {
              padding: 5,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 5,
              width: "40%",
            },
            get_status_background(item.status_type),
          ]}
        >
          <Text
            style={[
              { fontFamily: regular, color: colors.error, fontSize: 12 },
              get_status_foreground(item.status_type),
            ]}
          >
            {item.status}
          </Text>
        </View>
        <View style={{ margin: 10 }} />
        <View
          style={{
            borderBottomWidth: 1,
            borderStyle: "dashed",
            borderColor: colors.grey,
          }}
        />
        {item.items != null ? (
          <View>
            {show_products(item.items)}
            {JSON.parse(item.items).length > 2 && (
              <View
                style={{
                  padding: 5,
                  width: "96%",
                  marginLeft: "2%",
                  marginTop: 20,
                  marginRight: "2%",
                  backgroundColor: colors.light_grey,
                  borderRadius: 5,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: regular,
                    color: colors.grey,
                    fontSize: 14,
                  }}
                >
                  +{JSON.parse(item.items).length - 2} More
                </Text>
              </View>
            )}
          </View>
        ) : (
          <View
            style={{
              padding: 5,
              width: "96%",
              marginLeft: "2%",
              marginTop: 20,
              marginRight: "2%",
              backgroundColor: colors.light_grey,
              borderRadius: 5,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{ fontFamily: regular, color: colors.grey, fontSize: 14 }}
            >
              Add the prescription products.
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </CardView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Loader visible={loading} />
      {order_list.length > 0 ? (
        <ScrollView style={{ padding: 10 }}>
          <View style={{ margin: 10 }}>
            <Text
              style={{
                fontFamily: bold,
                color: colors.theme_fg_two,
                fontSize: 20,
              }}
            >
              My Orders
            </Text>
          </View>
          <FlatList
            data={order_list}
            renderItem={render_list}
            keyExtractor={(item) => item.id}
          />
          <View style={{ margin: 50 }} />
        </ScrollView>
      ) : (
        <View
          style={{
            width: "100%",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontFamily: bold,
              color: colors.theme_fg_two,
              fontSize: 16,
            }}
          >
            Sorry no orders found
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.theme_bg_three,
  },
});

export default MyOrders;
