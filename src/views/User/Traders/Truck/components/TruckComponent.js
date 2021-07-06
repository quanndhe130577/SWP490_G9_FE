import React, { useState, useEffect, useRef } from "react";
import {
    Row,
    Col,
    Select
} from 'antd';
// import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import "./styles.css";
// import { switchStatement } from "@babel/types";
import OtoComponent from './otoComponent';





export default function TruckComponent(props) {
    // const {
    //     isModal
    // } = props;

    const refForm = useRef();
    const [data, setData] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const data = [
            {
                drum: "1", basker: "1,3", weight: 500, id: 2
            },
            {
                drum: "2", basker: "1,3", weight: 200, id: 4
            },
            {
                drum: "3", basker: "3", weight: 50, id: 5
            },
            {
                drum: "4", basker: "1,3", weight: 70, id: 9
            },
            {
                drum: "5", basker: "1,3", weight: 300, id: 10
            },
            {
                drum: "6", basker: "1,3", weight: 300, id: 11
            }
        ]
        setData(data)
    }
    //
    const { Option } = Select;
    const provinceData = ['27/5/2021', '28/5/2021'];
    const cityData = {
        "27/5/2021": ['oto1', 'tam', 'tam'],
        "28/5/2021": ['congbang', 'tam', 'vta'],
    };

    const [cities, setCities] = React.useState(cityData[provinceData[0]]);
    const [secondCity, setSecondCity] = React.useState(cityData[provinceData[0]][0]);

    const handleProvinceChange = value => {
        setCities(cityData[value]);
        setSecondCity(cityData[value][0]);
    };

    const onSecondCityChange = value => {
        setSecondCity(value);
    }
    //
    return (
        <>
            <Row className="mb-4" gutter={24}>
                <Col span={8}>
                    <Select defaultValue={provinceData[0]} style={{ width: "100%" }} onChange={handleProvinceChange}>
                        {provinceData.map(province => (
                            <Option key={province}>{province}</Option>
                        ))}
                    </Select>
                </Col>
                <Col span={8}>
                    <Select style={{ width: "100%" }} value={secondCity} onChange={onSecondCityChange}>
                        {cities.map(city => (
                            <Option key={city}>{city}</Option>
                        ))}
                    </Select>
                </Col>

            </Row>
            <Row>
                <OtoComponent data={data} refForm={refForm} setData={setData} />
                {/* <Col span={12}>
                    <Form
                        ref={refForm}
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 14 }}
                        layout="horizontal">
                        <Form.Item label="drum" name="drum">
                            <Input />
                        </Form.Item>
                        <Form.Item label="basker" name="basker">
                            <Input />
                        </Form.Item>
                        <Form.Item label="weight" name="weight">
                            <Input />
                        </Form.Item>

                    </Form>
                </Col> */}
            </Row >
        </>

    )
}