import { View, Text, Dimensions } from 'react-native';
import React from 'react';
import { PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get("screen").width-70;

const Chart = ({outOfStock, inStock}) => {
    const data = [
        {
            name:"Out Of Stock",
            population:outOfStock,
            color:"red",
            legendFontColor:"red"
        },
        {
            name:"In Stock",
            population:inStock,
            color:"green",
            legendFontColor:"green"
        },
    ]
    const chartConfig = {
        color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    }

  return (
    <View>
      <PieChart
        data={data}
        width={screenWidth}
        height={150}
        chartConfig={chartConfig}
        accessor={"population"}
        backgroundColor={"transparent"}
        paddingLeft={"15"}
        center={[0, 0]}
        absolute
     />
    </View>
  )
}

export default Chart;