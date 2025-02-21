import { View, Text, Image, Pressable } from 'react-native'
import React from 'react'
import { useDispatch } from 'react-redux'
import { colors } from '../constants'
import { MinusIcon, PlusIcon, TrashIcon } from 'react-native-heroicons/outline'
import { decreaseQuantity, deleteProduct, increaseQuantity } from '../redux/orebiSlices'

const CartProduct = ({ item }) => {
    const dispatch = useDispatch();
    const totalPrice = item.price * item.quantity;

    return (
        <View style={{
            paddingVertical: 10,
            paddingHorizontal: 15,
            backgroundColor: colors.defaultWhite,
            marginBottom: 10,
            borderRadius: 6,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', width: 180 }}>
                <Image source={{ uri: item.image }} style={{ width: 60, height: 60 }} />
                <View style={{ marginLeft: 10 }}>
                    <Text style={{ color: colors.textBlack, fontWeight: '700' }}>{item.name}</Text>
                    <Text style={{ color: colors.textGray }}>Price: ${item.price}</Text>
                </View>
            </View>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderWidth: 0.5,
                borderColor: colors.lightText,
                borderRadius: 4,
                width: 90,
                height: 45,
                justifyContent: 'space-between',
                paddingHorizontal: 5,
            }}>
                <Pressable onPress={() => dispatch(decreaseQuantity({ productId: item.productId }))}>
                    <MinusIcon size={16} color={colors.textBlack} />
                </Pressable>
                <Text style={{ color: colors.textBlack, fontWeight: '800' }}>{item.quantity}</Text>
                <Pressable onPress={() => dispatch(increaseQuantity({ productId: item.productId }))}>
                    <PlusIcon size={16} color={colors.textBlack} />
                </Pressable>
            </View>
            <Text style={{ color: colors.textBlack, fontWeight: '800' }}>${totalPrice.toFixed(2)}</Text>
            <Pressable onPress={() => dispatch(deleteProduct(item.productId))}>
                <TrashIcon size={20} color={colors.textBlack} />
            </Pressable>
        </View>
    );
};

export default CartProduct;