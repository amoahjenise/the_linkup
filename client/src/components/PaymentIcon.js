import React from "react";
import PaymentIcon from "@material-ui/icons/Payment";

const PayIconWithTooltip = ({ width, height, fontSize, color }) => {
  return (
    <span title="I'll pay!" style={{ width, height }}>
      <PaymentIcon style={{ fontSize, color }} />
    </span>
  );
};

export default PayIconWithTooltip;
