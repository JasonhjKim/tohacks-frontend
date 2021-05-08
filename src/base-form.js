import React, { Component } from 'react';
import { Container, Row, Col, ToggleButtonGroup, ToggleButton} from 'react-bootstrap'
import styled from 'styled-components';
import Dropzone from 'react-dropzone';
import axios from 'axios';


export default class BaseForm extends Component {
    
    state = {
        labelCount: [""],
        py: null,
        selected: null
    }

    componentDidMount() {
        // const socket = io('http://localhost:5000/',  { transport : ['websocket'] })
        // socket.on('connect', (data) => {
        //     this.setState({ sid: socket.id})
        // })

        // socket.emit('connection')

        // socket.on('get_sid', (data) => {
        //     console.log(data)
        // })
    }
    
    handleAddLabelButton(e) {
        e.preventDefault();
        const temp = this.state.labelCount
        temp.push("");
        this.setState({ labelCount: temp })
    }

    handleInputChange(e) {
        const { name, value} = e.target
        console.log(`${name}: ${value}`)
        this.setState({ [name]: value })
    }

    handleOnDrop(i, images) {
        let name = i + "image";
        console.log(images);
        images.map((image) => {
            Object.assign(image, { preview: URL.createObjectURL(image)})
        })
        if(this.state.[name]) {
            this.setState(prevState => ({
                [name]: prevState.[name].concat(images)
            }));
        } else {
            this.setState({
                [name]: images
            })
        }
        console.log(this.state);
    }

    handleSubmit(e) {
        e.preventDefault();
        var formData = new FormData();
        if (this.state.labelCount && this.state.labelCount.length > 1) {
            this.state.labelCount.map((ele, i) => {
                this.state.[i +"image"].map((image) => {
                    console.log("called", [i+"label"], image);
                    formData.append(this.state.[i+"label"], image);
                })
            })
        }

        formData.append("models", this.state.selected);

        axios.post('http://69.172.162.104:5000/api/v1/finetune', formData)
            .then(res => console.log(res))
            .catch(err => console.log(err)) 
    }

    handleToggleButtonChange(e) {
        // e.preventDefault();
        this.setState({selected: e}, () => console.log(this.state.selected))
    }

    render() {
        const base = ["VGG16", "VGG19", "ResNet50", "ResNet152", "EfficientNet", "MobileNet", "Xception"];
        return(
            <StyledForm onSubmit={this.handleSubmit.bind(this)}>
                <FormTitle>Base Model: </FormTitle>
                <FormComponent>
                    <FormLabel>Models (choose all that applies)</FormLabel>
                    <ToggleButtonGroup type="checkbox" className="mb-2" onChange={this.handleToggleButtonChange.bind(this)}>
                        {
                            base.map((b, i) => <StyledToggleButton value={b}>{b}</StyledToggleButton>)
                        }
                    </ToggleButtonGroup>
                </FormComponent>

                <AddLabelButton onClick={this.handleAddLabelButton.bind(this)}>Add Label</AddLabelButton>
                <FormTitle>Labels</FormTitle>
                {
                    this.state.labelCount.map((ele, i) => (
                        <AddLabelWrapper>
                            <FormComponent>
                                <FormLabel>Label Name:</FormLabel>
                                <FormTextInput type="text" placeholder="Label Name" name={i + "label"} value={this.state.value} onChange={ this.handleInputChange.bind(this) }/>
                            </FormComponent>
                            <FormComponent>
                                <FormLabel>Label Images:</FormLabel>
                                <Dropzone
                                    onDrop={ this.handleOnDrop.bind(this, i)}
                                    multiple
                                >
                                {({getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject}) => (
                                    <InnerDropzone {...getRootProps({}) }>
                                        <input {...getInputProps()} />
                                        { !this.state.[i + "image"] && "Drag up to 10 images (png)"}
                                        <ImageContainer>
                                            { this.state.[i + "image"] ? this.state.[i + "image"].map((image) => 
                                                <Img src={image.preview} />
                                                )
                                            : null}
                                        </ImageContainer>
                                    </InnerDropzone>
                                )}
                                </Dropzone>
                            </FormComponent>
                            <HR />
                        </AddLabelWrapper>
                    ))
                }

                <StyledSubmit type="submit"/>
            </StyledForm>
        )
    }
}


const StyledForm = styled.form`
    // background-color: grey;
    display: flex;
    flex-direction: column;
`

const AddLabelButton = styled.button`
    width: 125px;
    height: 40px;
    align-self: flex-end;
    background-color: #9F9FED;
    color: white;
    border: none;
    border-radius: 4px;
    
`

const File = styled.div`
    width: 100%;
    height: 50px;
    background-color: #FECEAB;
    color: white;
    text-align: center;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`

const AddLabelWrapper = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 2em;
`

const FormComponent = styled.div`
    margin-bottom : 1em;
    display: flex;
    flex-direction: column;
`

const FormTextInput = styled.input`
    width: 350px;
    border: none; 
    background-color: #E8E8E8;
    border-radius: 4px;
    padding: 0.5em 1em;
`

const FormSelect = styled.select`
    border: none; 
    background-color: #E8E8E8;
    border-radius: 4px;
    padding: 0.5em 1em;
`

const FormGoogleDriveInput = styled.input`
    border: none; 
    background-color: #E8E8E8;
    border-radius: 4px;
    padding: 0.5em 1em;
`

const FormLabel = styled.label`
    margin: 0;
    padding: 0;
    font-size: 0.90em;
    font-weight: bold;
    color: #4E4E4E;
`

const HR = styled.div`
    border-top: 1px solid lightgray;
    margin-top: 1em;
    width: 90%;
    align-self: center;
`

const InnerDropzone = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px;
  border-width: 2px;
  border-radius: 2px;
  border-color: ${props => getColor(props)};
  border-style: dashed;
  background-color: #E8E8E8;
  color: #bdbdbd;
  outline: none;
  transition: border .24s ease-in-out;
`

const ImageContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    overflow-y: scroll;
    max-height: 500px;
`
const FormTitle = styled.h4`
    margin-top: 2em;
    color: #2B2B2B;
`

const Img = styled.img`
    width: 100px;
    height: 100px;
    object-fit: cover;
    border: 1px solid lightgray;
    border-radius: 4px;
    padding: 4px;
    margin: 0.25em
`


const StyledSubmit = styled.input`
    height: 55px;
    background-color: #736CED;
    border: none;
    border-radius: 4px;
    color: white;
`

const StyledToggleButton = styled(ToggleButton)`
    background-color: #9F9FED;
    border-color: #9F9FED;

    &:checked {
        background-color: #736CED;
        border-color: #736CED;
    }

    &:active {
        background-color: #736CED;
        border-color: #736CED;
    }

    &:checked + label {
        background-color: #736CED;
        border-color: #736CED;
    }
`


const getColor = (props) => {
  if (props.isDragAccept) {
      return '#00e676';
  }
  if (props.isDragReject) {
      return '#736CED';
  }
  if (props.isDragActive) {
      return '#2196f3';
  }
  return '#eeeeee';
}


//Color:
// #736CED
// #9F9FED
// #D4C1EC
// #FEF9FF
// #F2DFD7