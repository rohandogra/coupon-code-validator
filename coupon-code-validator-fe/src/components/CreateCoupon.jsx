import React, { useEffect, useState } from "react";
import { Field, Form, Formik, ErrorMessage } from "formik";
import { Button, Input, DatePicker, Select } from "antd";
import moment from "moment";

import "./createCoupon.css";
import * as Yup from "yup";
import Swal from "sweetalert2";
import axios from "../config/axios";
import ApplyCoupon from "./ApplyCoupon";

const { Option } = Select;
const { RangePicker } = DatePicker;

const CreateCoupon = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [optionsCoupons, setOptionsCoupons] = useState([]);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const response = await axios.get("/coupon");
      setOptionsCoupons(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const [dateRange, changeDateRange] = useState(null);
  const [dateString, changeDateString] = useState(null);

  const onDateRangeChange = (dateRange, dateString) => {
    if (dateRange) {
      changeDateRange(returnMomentDateRange(dateRange[0], dateRange[1]));
      changeDateString(dateString);
    } else {
      changeDateRange([]);
    }
  };

  const returnMomentDateRange = (start, finish) => {
    return [moment(start, "YYYY-MM-DD"), moment(finish, "YYYY-MM-DD")];
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-evenly" }}>
      <div style={{ width: "30%" }}>
        <h1>Create a Coupon</h1>
        <Formik
          initialValues={{
            couponCode: "",
            category: "",
            discountValue: "",
            maxDiscountAmount: "",
          }}
          validationSchema={Yup.object().shape({
            couponCode: Yup.string()
              .max(128, "Must be 128 characters or less")
              .required("Required"),
            category: Yup.string().required("Required"),
            discountValue: Yup.number().when("percent", {
              is: true,
              then: Yup.number()
                .required("Required")
                .typeError("settings.credit_not_allow_decimal_validation_text")
                .positive("number needs to be positive")
                .max(99, "Must be in range of 1 to 99"),
              otherwise: Yup.number()
                .required("Required")
                .typeError("settings.credit_not_allow_decimal_validation_text")
                .positive("number needs to be positive"),
            }),
            maxDiscountAmount: Yup.number()
              .typeError("settings.credit_not_allow_decimal_validation_text")
              .positive("number needs to be positive"),
          })}
          onSubmit={async (values, { resetForm }) => {
            const data = {
              ...values,
              startDate:dateString[0],
              endDate:dateString[1]
            }
            try {
              const response = await axios.post("/coupon", data);
              if (response.data) {
                Swal.fire({
                  title: "Coupon created successfully",
                  icon: "success",
                  confirmButtonText: "Ok",
                });
                changeDateRange([]);
                changeDateString([])
                fetchCoupons();
                resetForm();
              }
            } catch (err) {
              if (err.response.data.error) {
              return Swal.fire({
                  title: "Error!",
                  text: err.response.data.error,
                  icon: "error",
                  confirmButtonText: "Ok",
                });
              }else if(err.response.data.message){
                return Swal.fire({
                  title: "Error!",
                  text: err.response.data.message,
                  icon: "error",
                  confirmButtonText: "Ok",
                });
              }
            }
          }}
        >
          {({ onChange, onBlur, restProps, validate }) => (
            <Form>
              <div className="form-container">
                <div className="field">
                  <Field
                    type="text"
                    name="couponCode"
                    as={Input}
                    placeholder="Please Enter Coupon Code"
                  />
                  <ErrorMessage
                    name="couponCode"
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
                  <Field name="category" validate={validate}>
                    {({
                      field: { value },
                      form: { setFieldValue, setFieldTouched },
                    }) => (
                      <Select
                        style={{ width: "100% " }}
                        onChange={(value, option) => {
                          setFieldValue("category", value);
                          setSelectedCategory(value);
                          onChange && onChange(value, option);
                        }}
                        onBlur={(value) => {
                          setFieldTouched("category");
                          onBlur && onBlur(value);
                        }}
                        placeholder="Select Category"
                        value={
                          value === "" || value === null ? undefined : value
                        }
                        {...restProps}
                      >
                        <Option value="flat">Flat</Option>
                        <Option value="percent">Percent</Option>
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
                <div className="field">
                  <RangePicker
                    allowClear={true}
                    // picker="date"
                    style={{ width: "100% " }}
                    value={dateRange !== "" ? dateRange : ""}
                    onChange={onDateRangeChange}
                  />
              
                </div>
                <div className="field">
                  <Field
                    type="number"
                    name="discountValue"
                    as={Input}
                    placeholder={`Please Enter Discount ${
                      selectedCategory === "percent" ? "percent" : "Amount"
                    }`}
                  />
                  <ErrorMessage
                    name="discountValue"
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
                {selectedCategory === "percent" ? (
                  <div className="field">
                    <Field
                      type="number"
                      name="maxDiscountAmount"
                      as={Input}
                      placeholder="Please Enter Maximun Allowed Amount"
                    />
                    <ErrorMessage
                      name="maxDiscountAmount"
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
                ) : null}
                <Button type="primary" htmlType="submit">Submit</Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>

      <div style={{ width: "50%" }}>
        <ApplyCoupon optionsCoupons={optionsCoupons} />
      </div>
    </div>
  );
};

export default CreateCoupon;
