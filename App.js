import Main from "./Main";
import {Provider} from "react-redux";
import { store } from "./redux/store";
import {StripeProvider} from "@stripe/stripe-react-native";
import ConnectionStatus from "./components/ConnectionStatus";

const stripeKey = "pk_test_51KZbatSCTaos6OWc6GTFouXCTmlUjKvcldEpnmQlS5P3XBX4I9PZB8mPq2RqfTr5fRoS6FGfaN9HRLGXA5Q5wtDt00OU558YbC"

export default function App() {
  return (
    <StripeProvider
      merchantIdentifier="nep-shop.com"
      threeDSecureParams={{
        backgroundColor:"#fff",
        timeout:5
      }}
      publishableKey={stripeKey}
    >
      <Provider store={store}>
        <ConnectionStatus />
        <Main/>
      </Provider>
    </StripeProvider>
  );
}

