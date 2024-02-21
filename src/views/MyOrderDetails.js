import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Image,
  Linking,
} from "react-native";
import {
  bold,
  regular,
  medicine,
  vendor_order_details,
  api_url,
  status_change,
  boys_online,
  base_url,
  assign_boy,
} from "../config/Constants";
import * as colors from "../assets/css/Colors";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import CardView from "react-native-cardview";
import Icon, { Icons } from "../components/Icons";
import ProgressCircle from "react-native-progress-circle-rtl";
import axios from "axios";
import Loader from "../components/Loader";
import database from "@react-native-firebase/database";
import { Picker } from "@react-native-picker/picker";

const MyOrderDetails = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [data, setData] = useState(undefined);
  const [id, setId] = useState(route.params.data);
  const [loading, setLoading] = useState(false);
  const [boys, setBoys] = useState([]);
  const [selectedBoy, setSelectedBoy] = useState();

  const handleBackButtonClick = () => {
    navigation.goBack();
  };

  console.log("selectedBoy", selectedBoy);
  useEffect(() => {
    const onValueChange = database()
      .ref(`/pharm_orders/${id}`)
      .on("value", (snapshot) => {
        get_order_details();
      });
    const unsubscribe = navigation.addListener("focus", async () => {
      await get_order_details();
      await get_online_boys();
    });
    return unsubscribe;
  }, []);

  const goMap = (lat, lang) => {
    const _destination = `${lat},${lang}`;
    Linking.openURL(
      `https://www.google.com/maps/dir/?api=1&destination=${_destination}&dir_action=navigate`
    );
  };

  const get_order_details = async () => {
    setLoading(true);
    await axios({
      method: "post",
      url: api_url + vendor_order_details,
      data: { order_id: id },
    })
      .then(async (response) => {
        setLoading(false);
        setData(response.data.result);
        console.log("order details", response.data.result);
      })
      .catch((error) => {
        setLoading(false);
        alert("Sorry something went wrong");
      });
  };
  const get_online_boys = async () => {
    setLoading(true);
    await axios({
      method: "post",
      url: api_url + boys_online,
      data: { pharmacy_id: global.id },
    })
      .then(async (response) => {
        setLoading(false);
        setBoys(response.data.result);
        console.log("boys are ", response.data.result);
      })
      .catch((error) => {
        setLoading(false);
        alert("Sorry something went wrong");
      });
  };

  // const select_gender = (value) =>{
  // 	console.log("Set gender", value)
  // 	setBoys(value)
  //   }

  const change_status = async (slug) => {
    console.log("api_url + status_change", api_url + status_change);
    console.log("data sent", id, slug);
    setLoading(true);
    await axios({
      method: "post",
      url: api_url + status_change,
      data: { order_id: id, slug: slug },
    })
      .then(async (response) => {
        setLoading(false);
        get_order_details();
      })
      .catch((error) => {
        setLoading(false);
        console.log("error is", error);
        alert(error);
      });
  };

  const assign_delivery_boy = async (slug) => {
    console.log("api_url", api_url + assign_boy);
    console.log("data sent", id, selectedBoy);
    setLoading(true);
    await axios({
      method: "post",
      url: api_url + assign_boy,
      data: { order_id: id, delivery_boy_id: selectedBoy },
    })
      .then(async (response) => {
        setLoading(false);
        change_status("reached_vendor");
        get_order_details();
      })
      .catch((error) => {
        setLoading(false);
        console.log("error is", error);
        alert(error);
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
      return (
        <View style={{ flexDirection: "row", marginTop: 10, marginBottom: 10 }}>
          <View style={{ width: "70%", alignItems: "flex-start" }}>
            <Text
              style={{ fontFamily: regular, color: colors.grey, fontSize: 17 }}
            >
              {data.product_name}
            </Text>
            <Text
              style={{ fontFamily: regular, color: colors.grey, fontSize: 12 }}
            >
              {data.unit} / x{data.qty}
            </Text>
          </View>
          <View style={{ width: "30%", alignItems: "flex-end" }}>
            <Text
              style={{ fontFamily: regular, color: colors.grey, fontSize: 17 }}
            >
              {global.currency}
              {data.price}
            </Text>
          </View>
        </View>
      );
    });
  };

  const get_notification_color = (status) => {
    if (status <= 6) {
      return colors.success;
    } else {
      return colors.error;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Loader visible={loading} />
      {data != undefined && (
        <ScrollView>
          <View
            style={{
              height: 250,
              backgroundColor: colors.theme_bg,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ProgressCircle
              percent={data.status_id * 16.666}
              radius={60}
              borderWidth={3}
              color={get_notification_color(data.status_id)}
              shadowColor={colors.grey}
              bgColor={colors.theme_bg}
            >
              <View
                style={{
                  height: 60,
                  width: 60,
                  backgroundColor: colors.theme_bg,
                }}
              >
                <Image
                  style={{ flex: 1, width: undefined, height: undefined }}
                  source={medicine}
                />
              </View>
            </ProgressCircle>
            <View style={{ margin: 10 }} />
            {data.status_id == 11 && (
              <Picker
                selectedValue={selectedBoy}
                style={styles.textField}
                dropdownIconColor={colors.theme_fg}
                onValueChange={(itemValue, itemIndex) =>
                  setSelectedBoy(itemValue)
                }
              >
                <Picker.Item label="Select Delivery Boy" />
                {boys !== undefined ? (
                  boys.map((country, index) => (
                    <Picker.Item
                      label={country.delivery_boy_name}
                      value={country.id}
                      key={index}
                    /> //<== country name works fine without problems
                  ))
                ) : (
                  <Text>No available boys</Text>
                )}
                {/* <Picker.Item style={{ fontSize:12, color:colors.theme_fg, fontFamily:regular }} value={itemValue} label="Select Delivery Boy" /> */}
              </Picker>
            )}
            {data.status_id > 6 && data.status_id !== 11 ? (
              <Text
                style={{
                  fontFamily: regular,
                  color: colors.error,
                  fontSize: 14,
                }}
              >
                {data.status}
              </Text>
            ) : (
              <Text
                style={{
                  fontFamily: regular,
                  color: colors.theme_fg_three,
                  fontSize: 14,
                }}
              >
                {data.status}
              </Text>
            )}
          </View>
          <CardView
            cardElevation={4}
            style={{ margin: 10, marginTop: -20 }}
            cardMaxElevation={4}
            cornerRadius={10}
          >
            <View style={{ padding: 20 }}>
              <View style={{ flexDirection: "row" }}>
                <View style={{ width: "50%", alignItems: "flex-start" }}>
                  <Text
                    style={{
                      fontFamily: regular,
                      color: colors.theme_fg_two,
                      fontSize: 17,
                    }}
                  >
                    {data.customer_name}
                  </Text>
                  <View style={{ margin: 2 }} />
                  <Text
                    style={{
                      fontFamily: regular,
                      color: colors.grey,
                      fontSize: 12,
                    }}
                  >
                    {data.created_at}
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
                    {data.total}
                  </Text>
                  <View style={{ margin: 2 }} />
                  <Text
                    style={{
                      fontFamily: regular,
                      color: colors.grey,
                      fontSize: 12,
                    }}
                  >
                    #{data.id}
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
                  get_status_background(data.status_type),
                ]}
              >
                <Text
                  style={[
                    { fontFamily: regular, color: colors.error, fontSize: 12 },
                    get_status_foreground(data.status_type),
                  ]}
                >
                  {data.status}
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
              {data.items ? (
                <View>{show_products(data.items)}</View>
              ) : (
                <Text
                  style={{
                    fontSize: 16,
                    color: colors.error,
                    fontFamily: bold,
                    textAlign: "center",
                    marginTop: 20,
                  }}
                >
                  Wait to add Products
                </Text>
              )}
              <View style={{ margin: 10 }} />
              {data.status_id == 1 && (
                <TouchableOpacity
                  onPress={change_status.bind(this, "cancelled_by_vendor")}
                  style={{
                    padding: 5,
                    width: "96%",
                    marginLeft: "2%",
                    marginRight: "2%",
                    backgroundColor: colors.error,
                    borderRadius: 5,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: regular,
                      color: colors.theme_fg_three,
                      fontSize: 14,
                    }}
                  >
                    Cancel This Order
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            {data.items != undefined &&
              (data.status_id == 2 || data.status_id == 11) &&
              boys.length > 0 && (
                <Picker
                  selectedValue={selectedBoy}
                  style={styles.textField}
                  dropdownIconColor={colors.theme_fg}
                  onValueChange={(itemValue, itemIndex) =>
                    setSelectedBoy(itemValue)
                  }
                >
                  <Picker.Item label="Select Delivery Boy" />
                  {boys !== undefined || boys.length > 0 ? (
                    boys.map((country, index) => (
                      <Picker.Item
                        label={country.delivery_boy_name}
                        value={country.id}
                        key={index}
                      /> //<== country name works fine without problems
                    ))
                  ) : (
                    <TouchableOpacity
                      style={{
                        height: 40,
                        position: "absolute",
                        bottom: 10,
                        width: "100%",
                        backgroundColor: colors.theme_bg,
                        padding: 10,
                        alignItems: "center",
                        justifyContent: "center",
                        width: "90%",
                        marginLeft: "5%",
                        borderRadius: 10,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: bold,
                          color: colors.theme_fg_three,
                          fontSize: 16,
                        }}
                      >
                        No available boys
                      </Text>
                    </TouchableOpacity>
                  )}
                  {/* <Picker.Item style={{ fontSize:12, color:colors.theme_fg, fontFamily:regular }} value={itemValue} label="Select Delivery Boy" /> */}
                </Picker>
              )}
            {data != undefined &&
              (data.status_id == 2 || data.status_id == 11) &&
              data.items != null &&
              boys.length > 0 &&
              selectedBoy !== undefined && (
                <TouchableOpacity
                  onPress={() => goMap(data.customer_lat, data.customer_lng)}
                  style={{
                    padding: 8,
                    marginTop: 30,
                    alignSelf: "center",
                    width: "55%",
                    marginLeft: "2%",
                    marginRight: "2%",
                    backgroundColor: colors.success,
                    borderRadius: 5,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: regular,
                      color: colors.theme_fg_three,
                      fontSize: 14,
                    }}
                  >
                    Customer Location
                  </Text>
                </TouchableOpacity>
              )}
          </CardView>
          <View style={{ margin: 30 }} />
        </ScrollView>
      )}

      {data != undefined && data.status_id == 1 && data.items != null && (
        <TouchableOpacity
          onPress={change_status.bind(this, "ready_to_dispatch")}
          style={{
            height: 40,
            position: "absolute",
            bottom: 10,
            width: "100%",
            backgroundColor: colors.theme_bg,
            padding: 10,
            alignItems: "center",
            justifyContent: "center",
            width: "90%",
            marginLeft: "5%",
            borderRadius: 10,
          }}
        >
          <Text
            style={{
              fontFamily: bold,
              color: colors.theme_fg_three,
              fontSize: 16,
            }}
          >
            Ready To Dispatch
          </Text>
        </TouchableOpacity>
      )}
      {data != undefined &&
        (data.status_id == 2 || data.status_id == 11) &&
        data.items != null &&
        boys.length > 0 &&
        selectedBoy !== undefined && (
          <TouchableOpacity
            onPress={assign_delivery_boy.bind(this, "reached_vendor")}
            style={{
              height: 40,
              position: "absolute",
              bottom: 10,
              width: "100%",
              backgroundColor: colors.theme_bg,
              padding: 10,
              alignItems: "center",
              justifyContent: "center",
              width: "90%",
              marginLeft: "5%",
              borderRadius: 10,
            }}
          >
            <Text
              style={{
                fontFamily: bold,
                color: colors.theme_fg_three,
                fontSize: 16,
              }}
            >
              Assign To Delivery Boy
            </Text>
          </TouchableOpacity>
        )}
      {/* {data != undefined &&
        data.status_id == 2 &&
        data.items != null &&
        boys.length == 0 && (
          <TouchableOpacity
            style={{
              height: 40,
              position: "absolute",
              bottom: 10,
              width: "100%",
              backgroundColor: colors.theme_bg,
              padding: 10,
              alignItems: "center",
              justifyContent: "center",
              width: "90%",
              marginLeft: "5%",
              borderRadius: 10,
            }}
          >
            <Text
              style={{
                fontFamily: bold,
                color: colors.theme_fg_three,
                fontSize: 16,
              }}
            >
              No available boys
            </Text>
          </TouchableOpacity>
        )} */}

      <TouchableOpacity
        onPress={handleBackButtonClick}
        style={{ position: "absolute", top: 10, left: 10 }}
      >
        <Icon
          type={Icons.Feather}
          name="arrow-left"
          color={colors.theme_fg_three}
          style={{ fontSize: 30 }}
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.theme_bg_three,
  },
});

export default MyOrderDetails;
