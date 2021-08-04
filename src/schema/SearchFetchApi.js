import React from "react";
import { Select, Spin } from "antd";
import debounce from "lodash/debounce";
import { apis } from "../services";
const { Option } = Select;
function DebounceSelect({
  fetchOptions,
  api,
  displayField,
  saveField,
  debounceTimeout = 800,
  items,
  ...props
}) {
  const [fetching, setFetching] = React.useState(false);
  const [options, setOptions] = React.useState(items || []);
  const fetchRef = React.useRef(0);
  const debounceFetcher = React.useMemo(() => {
    const loadOptions = async (value) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setOptions([]);
      setFetching(true);

      let data = await fetchOptions(api, value, displayField);
      if (data && data.length) {
        if (fetchId !== fetchRef.current) {
          // for fetch callback order
          return;
        }
        setOptions(data);
        setFetching(false);
      }
    };

    return debounce(loadOptions, debounceTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchOptions, debounceTimeout]);
  return (
    <Select
      labelInValue
      filterOption={false}
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin size="small" /> : null}
      {...props}
    >
      {options.map((item) => (
        <Option value={item.value || item[saveField]} key={item[saveField]}>
          {item.label || item[displayField] || item.type}
        </Option>
      ))}
    </Select>
  );
} // Usage of DebounceSelect

async function fetchUserList(api, param, displayField) {
  if (api && api.url) {
    let rs = (await apis[api.url](api.body, api.method, param)) || [];

    if (rs && rs.statusCode === 200) {
      let idx = 0;
      for (const ele of rs.data) {
        ele.idx = idx + 1;
        idx++;
        // check  display field is array then convert to string
        if (displayField && Array.isArray(displayField)) {
          let temStr = "";
          for (const field of displayField) {
            temStr += ele[field] + "  ";
          }
          ele.label = temStr;
        }
      }
    }
    return rs.data;
  } else {
    console.log("Error: api not define");
  }
}

const SearchFetchApi = ({
  displayField = "name",
  saveField = "id",
  api = {},
  onChange, // for multiple value
  placeholder,
  value,
  label,
  submitted,
  required,
  error,
  onSelect, // for 1 value
  items = [],
  disabled,
  isOne,
}) => {
  return (
    <div className={"form-group" + (submitted && !value ? " has-error" : "")}>
      {label && (
        <label className="bold">
          {label} {required ? <span style={{ color: "red" }}>*</span> : ""}
        </label>
      )}
      <DebounceSelect
        mode="multiple"
        value={value}
        placeholder={placeholder}
        fetchOptions={fetchUserList}
        onChange={(newValue) => {
          if (onChange) {
            let arr = {};
            if (isOne && newValue.length > 0) {
              arr = newValue[newValue.length - 1];
            } else arr = newValue;
            onChange(arr);
          }
        }}
        onSelect={(value) => {
          if (onSelect) {
            onSelect(value);
          }
        }}
        displayField={displayField}
        saveField={saveField}
        api={api}
        style={{
          width: "100%",
        }}
        items={items}
        disabled={disabled}
      />
      {submitted && !value && (
        <div className="help-block">{label} is required</div>
      )}
      {submitted && !error && <div className="help-block">{error}</div>}
    </div>
  );
};
export default SearchFetchApi;
