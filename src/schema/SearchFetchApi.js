import React from "react";
import { Select, Spin } from "antd";
const { Option } = Select;

const Demo = ({
  fetchOptions,
  onChange,
  value,
  label,
  error,
  required,
  submitted,
  placeholder,
}) => {
  const [fetching, setFetching] = React.useState(false);
  const [options, setOptions] = React.useState([]);

  const debounceFetcher = async (val) => {
    if (val) {
      setFetching(true);
      let rs = await fetchOptions(val);
      if (rs && rs.statusCode === 200) {
        // eslint-disable-next-line array-callback-return
        rs.data.map((el) => {
          el.key = el.id;
          el.label = el.lastname + " " + el.firstName + " - " + el.phoneNumber;
        });
        setOptions(rs.data);
      }
      setFetching(false);
    } else {
      setOptions([]);
    }
  };

  // const Select2 = React.memo(props => (<Select
  //   mode="multiple"
  //   value={value}
  //   placeholder={placeholder}
  //   fetchOptions={fetchOptions}
  //   onChange={onChange}
  //   onSearch={debounceFetcher}
  //   notFoundContent={fetching ? <Spin size="small" /> : null}
  //   style={{
  //     width: "100%",
  //   }}
  // >
  //   {props.options2.map((d) => (
  //     <Option key={d.key}>{d.label}</Option>
  //   ))}
  // </Select>));
  return (
    <div className={"form-group" + (submitted && !value ? " has-error" : "")}>
      {label && (
        <label className="bold">
          {label} {required ? <span style={{ color: "red" }}>*</span> : ""}
        </label>
      )}
      <Select
        mode="multiple"
        value={value}
        placeholder={placeholder}
        fetchOptions={fetchOptions}
        onChange={onChange}
        onSearch={debounceFetcher}
        notFoundContent={fetching ? <Spin size="small" /> : null}
        style={{
          width: "100%",
        }}
      >
        {options.map((d) => (
          <Option key={d.key}>{d.label}</Option>
        ))}
      </Select>
      {submitted && !value && (
        <div className="help-block">{label} is required</div>
      )}
      {submitted && !error && <div className="help-block">{error}</div>}
    </div>
  );
};

export default Demo;
