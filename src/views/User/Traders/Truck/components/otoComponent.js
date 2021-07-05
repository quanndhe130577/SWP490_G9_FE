import React, { useEffect } from "react";
import {
    Form,
    Button,
    Row,
    Col
} from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import "./styles.css";

export default function OtoComponent(props) {
    const { span = 12, data, refForm, isRemove = true, setData } = props;

    const [form] = Form.useForm();

    const onFinish = (values) => {
        console.log(values)
    }

    useEffect(() => {
        form.setFieldsValue({ trucks: data })
    }, [data]);

    const renderColor = (weight) => {
        let color = ""
        if (weight >= 500) color = "#e50606";
        if (weight >= 400 && weight < 500) color = "#c22b2b";
        if (weight >= 300 && weight < 400) color = "#e1713b";
        if (weight >= 100 && weight < 200) color = "#e9d01c";
        if (weight < 100) color = "green";
        return color;
    }

    const showDetailTruck = (index) => {
        console.log(data[index]);
        refForm.current.setFieldsValue(data[index])
    }
    const deleteDrum = (id) => {

        const newData = [...data];
        const indexItemDel = newData.findIndex((x) => x.id === id);
        if (indexItemDel !== -1) {
            newData.splice(indexItemDel, 1);
            setData(newData)
        }
        console.log("acb" + id)
    }
    return (
        <Col span={span}>
            <span>oto1</span>
            <Form form={form} name="dynamic_form_item" onFinish={onFinish}>
                <Form.List
                    name="trucks"
                    rules={[
                        {
                            validator: async (_, names) => {
                                if (!names || names.length < 2) {
                                    return Promise.reject(new Error('At least 2 passengers'));
                                }
                            },
                        },
                    ]}
                >
                    {(fields, { add, remove }, { errors }) => (
                        <Row gutter={50}>
                            {fields.map((field, index) => (
                                <Col span={12}>
                                    <Form.Item
                                        label=""
                                        required={false}
                                        key={field.key}
                                    >
                                        <Form.Item
                                            {...field}
                                            validateTrigger={['onChange', 'onBlur']}
                                            rules={[
                                                {
                                                    required: true,
                                                    whitespace: true,
                                                    message: "Please input passenger's name or delete this field.",
                                                },
                                            ]}
                                            noStyle
                                        >
                                            <div className={`btn_view`}>
                                                <div
                                                    className="btn_click_truck"
                                                    // style={{ background: `${renderColor(data[index].weight)}` }}
                                                    onClick={() => showDetailTruck(index)}
                                                >
                                                    <p class="text_drum">{index + 1}</p>
                                                    <p class="text_drum"> weight: {data[index].weight}</p>
                                                    <p class="text_drum"> id: {data[index].id}</p>
                                                </div>
                                                {isRemove && fields.length >= 1 ? (
                                                    <MinusCircleOutlined
                                                        className="dynamic-delete-button"
                                                        onClick={() => {
                                                            remove(field.name);
                                                            deleteDrum(data[index].id);
                                                        }}
                                                    />
                                                ) : null}
                                            </div>

                                        </Form.Item>
                                    </Form.Item>
                                </Col>
                            ))}
                            <Col span={12}>
                                <Form.Item>
                                    <Button
                                        type="dashed"
                                        onClick={() => add()}
                                        style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                                        icon={<PlusOutlined />}
                                    >
                                    </Button>
                                    <Form.ErrorList errors={errors} />
                                </Form.Item>
                            </Col>
                        </Row>
                    )}
                </Form.List>
            </Form>
        </Col>
    )
}