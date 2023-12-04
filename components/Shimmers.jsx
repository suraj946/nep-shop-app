import { StyleSheet, View, Text } from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import { colors } from "../styles/styles";

export const CardWithBadgeShimmer = () => {
  return (
    <View style={styles.badgeMain}>
      <View style={styles.head} />
      <View style={styles.badgeCard} />
    </View>
  );
};

export const CardItemShimmer = () => {
  return (
    <View style={styles.badgeMain}>
      <View style={styles.head} />
      <View style={styles.cardCont}>
        <View style={styles.itemCard} />
        <View style={styles.itemCard} />
      </View>
    </View>
  );
};

export const ProductCardShimmer = () => {
  return (
    <View style={styles.badgeMain}>
      <View style={styles.head} />
      <View style={styles.card} />
    </View>
  );
};

export const ProductDetailShimmer = () => {
  return (
    <View style={{
      width:"95%",
      flex:1,
      marginTop:verticalScale(20),
      alignSelf:"center"
    }}>
      <View style={{
        flex:0.5,
        backgroundColor:colors.shimmerColor,
        marginBottom:5,
        width:"100%",
        borderRadius:moderateScale(5),
        justifyContent:"center",
        alignItems:"center"
      }} >
        <View style={{
          width:"95%",
          height:"95%",
          backgroundColor:colors.shimmerColorDark,
          borderRadius:moderateScale(5)
        }}/>
      </View>
      <View style={{
        flex:0.5,
        backgroundColor:colors.shimmerColor,
        padding:moderateScale(5),
        justifyContent:"center",
        alignItems:"center",
        width:"100%",
        borderTopLeftRadius:moderateScale(50),
        borderTopRightRadius:moderateScale(50),
      }}>
        <View style={styles.detailTextView} />
        <View style={styles.detailTextView} />
        <View style={styles.detailTextView} />
        <View style={styles.detailTextView} />
        <View style={styles.detailTextView} />
        <View style={styles.detailTextView} />
        <View style={{...styles.detailTextView, width:"60%"}} />
      </View>
    </View>
  );
};

export const OrderShimmer = () => {
  return (
    <View style={{
        width:"98%",
        alignSelf:"center",
        height:verticalScale(200),
        backgroundColor:colors.shimmerColor,
        borderRadius:moderateScale(5),
        justifyContent:"center",
        alignItems:"center",
        marginVertical:verticalScale(5)
      }}
    >
      <View style={styles.detailTextView} />
      <View style={styles.detailTextView} />
      <View style={styles.detailTextView} />
      <View style={styles.detailTextView} />
      <View style={styles.detailTextView} />
    </View>
  )
}

// export const TableShimmer = () => {
//   return (
//     <View style={{justifyContent:"center", alignItems:"center",marginVertical:verticalScale(10)}}>
//       {
//        Array.from({length:10}).fill(0).map((_, index) => (
//           <View key={index} style={styles.tableHead}>
//             <View style={styles.headElement} />
//             <View style={styles.headElement} />
//             <View style={styles.headElement} />
//             <View style={styles.headElement} />
//             <View style={styles.headElement} />
//           </View>
//         ))
//       }
//       <View></View>
//     </View>
//   )
// }

const styles = StyleSheet.create({
  badgeMain: {
    justifyContent: "center",
    alignItems: "center",
  },
  badgeCard: {
    width: scale(317),
    height: scale(200),
    borderRadius: 5,
    backgroundColor: colors.shimmerColor,
  },
  head: {
    width: "90%",
    height: verticalScale(30),
    backgroundColor: colors.shimmerColor,
    alignSelf: "flex-start",
    margin: moderateScale(10),
  },

  //for item
  cardCont: {
    flexDirection: "row",
  },
  itemCard: {
    width: scale(150),
    height: verticalScale(185),
    backgroundColor: colors.shimmerColor,
    borderRadius: 10,
    margin: moderateScale(5),
  },

  //product card
  card: {
    width: scale(190),
    height: verticalScale(290),
    backgroundColor: colors.shimmerColor,
    borderRadius: 10,
  },

  //product details
  detailTextView:{
    width:"95%",
    margin:moderateScale(5),
    borderRadius:moderateScale(10),
    backgroundColor:colors.shimmerColorDark,
    height:verticalScale(30)
  },

  // //table shimmer
  // tableHead:{
  //   width:"95%",
  //   height:verticalScale(30),
  //   backgroundColor:colors.shimmerColorDark,
  //   justifyContent:"space-evenly",
  //   flexDirection:"row",
  //   alignItems:"center",
  //   borderRadius:moderateScale(8),
  //   marginTop:verticalScale(3)
  // },
  // headElement:{
  //   width:"18%", 
  //   height:verticalScale(28), 
  //   backgroundColor:colors.shimmerColor,
  //   borderRadius:moderateScale(5)
  // }
});
