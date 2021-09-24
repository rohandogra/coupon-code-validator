import React, { useState } from "react";
import { Field, Form, Formik, ErrorMessage } from "formik";
import { Button, Input, Select } from "antd";
import "./applyCoupon.css";
import * as Yup from "yup";
import Swal from "sweetalert2";
import axios from "../config/axios";

const { Option } = Select;

const ApplyCoupon = ({optionsCoupons}) => {
  const [couponData, setCouponData] = useState(null);
  const [error, setError] = useState("");



  return (
    <div >
      <h1>Apply Coupon</h1>
      <Formik
        initialValues={{
          amount: "",
          code: "",
        }}
        validationSchema={Yup.object().shape({
          amount: Yup.number()
            .required("Required")
            .typeError("settings.credit_not_allow_decimal_validation_text")
            .positive("number needs to be positive"),
          code: Yup.string().required("Required"),
        })}
        onSubmit={async (values, { resetForm }) => {
          try {
            const response = await axios.get(
              `/verify-coupon?totalamount=${values.amount}&code=${values.code}`
            );
            setCouponData(response.data);
            setError(null)
          } catch (e) {
            if (e.response && e.response.data) {
              Swal.fire({
                title: 'Error!',
                text: e.response.data.error,
                icon: 'error',
                confirmButtonText: 'Cool'
              }) 
              setError(e.response.data.error);
              setCouponData(null)
            }
          }
        }}
      >
        {({ onChange, onBlur, restProps, validate }) => (
          <Form>
            <div style={{ display: "flex" ,justifyContent:"center"}}>
              <div className="field">
                <Field
                  type="number"
                  name="amount"
                  as={Input}
                  placeholder="Please Enter Amount"
                />
                <ErrorMessage
                  name="amount"
                  render={(msg) => (
                    <div
                      style={{
                        color: "red",
                        fontSize: "12px",
                        lineHeight: "2",
                        marginBottom: "-20px",
                      }}
                    >{`*${msg}`}</div>
                  )}
                />
              </div>

              <div className="field">
                <Field name="code" validate={validate}>
                  {({
                    field: { value },
                    form: { setFieldValue, setFieldTouched },
                  }) => (
                    <Select
                      style={{ width: "100% " }}
                      onChange={(value, option) => {
                        setFieldValue("code", value);
                        // setSelectedCode(value);
                        onChange && onChange(value, option);
                      }}
                      onBlur={(value) => {
                        setFieldTouched("code");
                        onBlur && onBlur(value);
                      }}
                      placeholder="Select Coupon Code"
                      value={value === "" || value === null ? undefined : value}
                      {...restProps}
                    >
                      {optionsCoupons.map((ele) => {
                        return (
                          <Option key={ele._id} value={ele.couponCode}>
                            {ele.couponCode}
                          </Option>
                        );
                      })}
                    </Select>
                  )}
                </Field>

                <ErrorMessage
                  name="category"
                  render={(msg) => (
                    <div
                      style={{
                        color: "red",
                        fontSize: "12px",
                        lineHeight: "2",
                        marginBottom: "-20px",
                      }}
                    >{`*${msg}`}</div>
                  )}
                />
              </div>

              <Button type="primary" htmlType="submit">Apply</Button>
            
            </div>
            <div>
                {couponData ? (<div>
                    <h2>{`${couponData?.couponCode} applied. ₹${couponData.discountedAmount} savings with this coupon.`}</h2>
                    <h2>{` Total amount to be paid is ₹${couponData?.totalAmountToBeDiscounted}`}</h2>
                </div>):null}
            </div>
            <div>
                {error ? (
                  <div>
                    <h2 style={{
                    color: "red",
                    fontSize: "16px",
                    lineHeight: "2",
                    marginBottom: "-20px",
                  }}>{error}</h2>
                  </div>
                ) : null}
              </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ApplyCoupon;
