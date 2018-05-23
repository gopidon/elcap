import React, {Component} from 'react';
import { Alert, Tabs, Divider, Icon, Button, Steps, message, Layout, Input, Radio, Checkbox, Progress} from 'antd';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import {formatDate} from '../utils/date';
import Environment from '../utils/env'
const { Table, Column, Cell } = require('fixed-data-table-2');
const TabPane = Tabs.TabPane;
const {Sider, Content} = Layout;
const Step = Steps.Step
import Loading from './widgets/Loading';
import XLSX from 'xlsx';
import _ from 'underscore'
//import io from 'socket.io-client';


const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;

const FLASK_APP_URL="http://35.200.253.121:5000";
//const FLASK_APP_URL="http://localhost:5000";

const formCFileHeaders = ["customer_name", "passport_number", "flight_number", "item_description", "quantity"];
const otherCompareOptions = [{label: 'Customer Name', value:'customer_name'}, {label:'Passport Number', value:'passport_number'}, {label:'Flight Number', value:'flight_number'}];

/*let socket = io.connect(FLASK_APP_URL);
socket.on('connect', function() {
    socket.on('my_pong', function(message) {
        console.log("Pong!!:", message.data);
    });
    socket.emit('my_ping', {data: {
        "formCFile":"https://files.graph.cool/cjcu3p0w61da40198ucdk7eri/cjd6ti18v00010115nb92cwpm",
        "apisFile":"https://files.graph.cool/cjcu3p0w61da40198ucdk7eri/cjd6tidri00050115e33npzom"
    }});
});*/

export default class NewsList extends Component
{

    constructor(props){
        super(props);
        let self = this;
        this.state = {
            uploadingApis: false,
            uploadingFormC: false,
            processing: false,
            apisFile: null,
            apisFileUploadProgress: 0,
            formCFile: null,
            formCFileUploadProgress: 0,
            matchedData: [],
            filteredMatchedData: [],
            unmatchedData: [],
            filteredUnmatchedData: [],
            fuzzyMatchedData:[],
            filteredFuzzyMatchedData: [],
            current: 0,
            matchedFileName:"",
            fuzzyMatchedFileName:"",
            unmatchedFileName:"",
            errorProcessing: false,
            errorMessage: "",
            compareBy: "passport_number",
            otherCompareList: ['customer_name','passport_number'],
            processingProgress:""
        }
    }

    componentDidMount(){
        let self = this;

    }

    updateProcessingProgress(msg){
        console.log("In update processing!")
        this.setState({
            processingProgress: msg.data
        })
    }



    next() {
        const current = this.state.current + 1;
        this.setState({ current });
    }

    prev() {
        const current = this.state.current - 1;
        this.setState({ current });
    }

    render(){
        const {apisFile, formCFile, matchedData, uploadingApis, uploadingFormC, filteredMatchedData,
                unmatchedData, filteredUnmatchedData, processing, current,
                matchedFileName, unmatchedFileName, errorProcessing, errorMessage,
                compareBy, otherCompareList, fuzzyMatchedData, filteredFuzzyMatchedData, fuzzyMatchedFileName, apisFileUploadProgress, formCFileUploadProgress} = this.state;
        //console.log("Error Processing:", errorProcessing);
        //console.log("Filtered:", filteredMatchedData);
        //console.log("Compare By:", compareBy);
        //console.log("Compare List:", otherCompareList);
        return (
            <Layout>
                <Content style={{ padding: '24px 0', background: '#fff'}}>
                    <Steps current={current}>
                        <Step key={1} title="Upload Duty Free Data (Form C)" />
                        <Step key={2} title="Upload Flights Data (APIS)" />
                        <Step key={3} title="Process Data" />
                    </Steps>
                    <div className="steps-content">
                        {
                            current == 0
                            &&
                            <div>
                                <h3>Upload Form C file</h3>
                                <p><b>Note:</b> Form C Excel file must contain the columns: <b>"customer_name", "passport_number", "flight_number", "item_description", "quantity"</b> </p>
                                <Divider/>
                                <form encType="multipart/form-data" method="POST">
                                    <input id="fileFormC" type="file" />
                                    <Button type="primary" loading={this.state.uploadingFormC} onClick={this._uploadFormCFile.bind(this)}>
                                        <Icon type="upload" /> Upload
                                    </Button>
                                    <Progress percent={formCFileUploadProgress} size="small" />
                                </form>
                            </div>

                        }
                        {
                            current==1
                            &&
                            <div>
                                <h3>Upload APIS file</h3>
                                <p><b>Note:</b> APIS Excel file must contain the columns: <b>"passenger_name", "passport_number", "flight_number"</b> </p>
                                <Divider/>
                                <form encType="multipart/form-data" method="POST">
                                    <input id="fileApis" type="file" />
                                    <Button type="primary" loading={this.state.uploadingApis} onClick={this._uploadApisFile.bind(this)}>
                                        <Icon type="upload" /> Upload
                                    </Button>
                                    <Progress percent={apisFileUploadProgress} size="small" />
                                </form>
                            </div>
                        }
                        {
                            current==2
                            &&
                            <div>
                                <div style={{marginTop: 25}}>
                                    {
                                        (uploadingApis || uploadingFormC) ?
                                            <h3>Uploading Files:</h3>:
                                            <h3>Uploaded Files:</h3>
                                    }

                                    <Divider/>
                                    {
                                        formCFile && !uploadingApis?
                                            <div>
                                                <a target="_blank" style={{marginLeft: 5}} href={formCFile}>FormC File</a>
                                            </div>:
                                            <div>
                                                <Icon type="loading"/>
                                            </div>
                                    }
                                    {
                                        apisFile && !uploadingFormC?
                                            <div>
                                                <a style={{marginLeft: 5}} target="_blank" href={apisFile}>APIS File</a>
                                            </div>:
                                            <div>
                                                <Icon type="loading"/>
                                            </div>

                                    }
                                    <Divider/>
                                    <h3>
                                        Compare by
                                    </h3>
                                    <RadioGroup onChange={this._onCompareByChange.bind(this)} value={this.state.compareBy}>
                                        <Radio value={"passport_number"}>Passport Number</Radio>
                                        <Radio value={"others"}>Others</Radio>
                                    </RadioGroup>
                                    {
                                        this.state.compareBy == "others"?
                                            <div style={{marginTop: 20}}>
                                                <CheckboxGroup options={otherCompareOptions} value={this.state.otherCompareList} onChange={this._onOtherCompareListChange.bind(this)} />
                                            </div>:<div/>

                                    }
                                </div>


                            </div>
                        }
                    </div>
                    <div className="steps-action">
                        {
                            this.state.current < 2
                            &&
                            <Button type="primary" onClick={this._goNext.bind(this, this.state.current)}>Next</Button>
                        }
                        {
                            this.state.current === 2
                            &&
                            <Button type="primary" loading={this.state.processing} onClick={this._process.bind(this)} disabled={uploadingApis || uploadingFormC || !(apisFile && formCFile)}>
                                <Icon type="sync"/> Process the files!
                            </Button>
                        }
                        {
                            this.state.current > 0
                            &&
                            <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
                                Previous
                            </Button>
                        }
                    </div>
                    <div style={{marginTop: 25}}>
                        {
                            processing?<Alert message="Processing takes time based on the size of flights Data. Please wait ..." type="info" />:<div/>
                        }
                    </div>
                    <div>
                        {
                            !errorProcessing && compareBy=='passport_number'?
                                <Tabs style={{marginTop: 25}} type="card">
                                    <TabPane tab="Unmatched Data" key="1">
                                        <div>
                                            {
                                                filteredUnmatchedData.length>0?
                                                    <div style={{margin: 25}}>
                                                        <div style={{marginBottom: 15}}>
                                                            <b>Number of Unmatched records:</b> {filteredUnmatchedData.length >= 1000 ? 'More than a 1000' : filteredUnmatchedData.length}
                                                        </div>
                                                        <div style={{marginBottom: 15}}>
                                                            <a style={{marginLeft: 5}} target="_blank" href={FLASK_APP_URL+'/data/'+unmatchedFileName}>Download in excel format (All records)</a>
                                                        </div>
                                                        <div style={{marginBottom: 15}}>
                                                            <b>Showing the {filteredUnmatchedData.length >= 1000 ? ' first 1000 ' : filteredUnmatchedData.length} records!</b>
                                                        </div>
                                                        <Input.Search
                                                            placeholder="Filter by Customer Name"
                                                            onSearch={this._filterUnmatched.bind(this,'customer_name')}
                                                            style={{ width: 200 }}
                                                        />
                                                        <span style={{display: 'inline-block',width: 100}}/>
                                                        <Input.Search
                                                            placeholder="Filter by Passport"
                                                            onSearch={this._filterUnmatched.bind(this, 'passport_number')}
                                                            style={{ width: 200 }}
                                                        />
                                                        <Input.Search
                                                            placeholder="Filter by Item"
                                                            onSearch={this._filterUnmatched.bind(this, 'item_description')}
                                                            style={{ width: 300 }}
                                                        />
                                                        <Table
                                                            rowHeight={50}
                                                            rowsCount={filteredUnmatchedData.length}
                                                            width={1100}
                                                            height={500}
                                                            headerHeight={50}
                                                            data={filteredUnmatchedData}
                                                        >
                                                            <Column
                                                                header={<Cell>Customer Name</Cell>}
                                                                columnKey="customer_name"
                                                                cell={({ rowIndex, columnKey, ...props }) =>
                                                                    <Cell {...props}>
                                                                        {filteredUnmatchedData[rowIndex][columnKey]}
                                                                    </Cell>}
                                                                fixed={true}
                                                                width={200}
                                                            />
                                                            <Column
                                                                header={<Cell>Flight No</Cell>}
                                                                columnKey="flight_number_x"
                                                                cell={({ rowIndex, columnKey, ...props }) =>
                                                                    <Cell {...props}>
                                                                        {filteredUnmatchedData[rowIndex][columnKey]}
                                                                    </Cell>}
                                                                fixed={true}
                                                                width={100}
                                                            />
                                                            <Column
                                                                header={<Cell>Passport</Cell>}
                                                                columnKey="passport_number"
                                                                cell={({ rowIndex, columnKey, ...props }) =>
                                                                    <Cell {...props}>
                                                                        {filteredUnmatchedData[rowIndex][columnKey]}
                                                                    </Cell>}
                                                                fixed={true}
                                                                width={200}
                                                            />
                                                            <Column
                                                                header={<Cell>Item Desc</Cell>}
                                                                columnKey="item_description"
                                                                cell={({ rowIndex, columnKey, ...props }) =>
                                                                {
                                                                    return <Cell {...props}>
                                                                        {filteredUnmatchedData[rowIndex][columnKey]}
                                                                    </Cell>
                                                                }
                                                                }
                                                                fixed={true}
                                                                width={300}
                                                            />
                                                            <Column
                                                                header={<Cell>Quantity</Cell>}
                                                                columnKey="quantity"
                                                                cell={({ rowIndex, columnKey, ...props }) =>
                                                                    <Cell {...props}>
                                                                        {filteredUnmatchedData[rowIndex][columnKey]}
                                                                    </Cell>}
                                                                fixed={true}
                                                                width={100}
                                                            />
                                                            {/*<Column
                                                             header={<Cell>Name</Cell>}
                                                             columnKey="Name"
                                                             cell={({ rowIndex, columnKey, ...props }) =>
                                                             <Cell {...props}>
                                                             {filteredUnmatchedData[rowIndex][columnKey]}
                                                             </Cell>}
                                                             fixed={true}
                                                             width={200}
                                                             />*/}
                                                        </Table>
                                                    </div>
                                                    :processing?<Loading/>:<div>No files processed yet!</div>
                                            }

                                        </div>
                                    </TabPane>
                                    <TabPane tab="Matched Data" key="2">
                                        <div>
                                            {
                                                filteredMatchedData.length>0?
                                                    <div style={{margin: 25}}>
                                                        <div style={{marginBottom: 15}}>
                                                            <b>Number of Matched records:</b> {filteredMatchedData.length >= 1000 ? 'More than a 1000' : filteredMatchedData.length}
                                                        </div>
                                                        <div style={{marginBottom: 15}}>
                                                            <a style={{marginLeft: 5}} target="_blank" href={FLASK_APP_URL+'/data/'+matchedFileName}>Download in excel format (All records)</a>
                                                        </div>
                                                        <div style={{marginBottom: 15}}>
                                                            <b><b>Showing the {filteredMatchedData.length >= 1000 ? ' first 1000 ' : filteredMatchedData.length} records!</b></b>
                                                        </div>
                                                        <Input.Search
                                                            placeholder="Filter by Customer Name"
                                                            onSearch={this._filterMatched.bind(this,'customer_name')}
                                                            style={{ width: 200 }}
                                                        />
                                                        <span style={{display: 'inline-block',width: 100}}/>
                                                        <Input.Search
                                                            placeholder="Filter by Passport"
                                                            onSearch={this._filterMatched.bind(this, 'passport_number')}
                                                            style={{ width: 200 }}
                                                        />
                                                        <Input.Search
                                                            placeholder="Filter by Item"
                                                            onSearch={this._filterMatched.bind(this, 'item_description')}
                                                            style={{ width: 300 }}
                                                        />
                                                        <Table
                                                            rowHeight={50}
                                                            rowsCount={filteredMatchedData.length}
                                                            width={1000}
                                                            height={500}
                                                            headerHeight={50}
                                                            data={filteredMatchedData}
                                                        >
                                                            <Column
                                                                header={<Cell>Customer Name</Cell>}
                                                                columnKey="customer_name"
                                                                cell={({ rowIndex, columnKey, ...props }) =>
                                                                    <Cell {...props}>
                                                                        {filteredMatchedData[rowIndex][columnKey]}
                                                                    </Cell>}
                                                                fixed={true}
                                                                width={200}
                                                            />
                                                            <Column
                                                                header={<Cell>Flight No</Cell>}
                                                                columnKey="flight_number_x"
                                                                cell={({ rowIndex, columnKey, ...props }) =>
                                                                    <Cell {...props}>
                                                                        {filteredMatchedData[rowIndex][columnKey]}
                                                                    </Cell>}
                                                                fixed={true}
                                                                width={100}
                                                            />
                                                            <Column
                                                                header={<Cell>Passport</Cell>}
                                                                columnKey="passport_number"
                                                                cell={({ rowIndex, columnKey, ...props }) =>
                                                                    <Cell {...props}>
                                                                        {filteredMatchedData[rowIndex][columnKey]}
                                                                    </Cell>}
                                                                fixed={true}
                                                                width={200}
                                                            />
                                                            <Column
                                                                header={<Cell>Item Desc</Cell>}
                                                                columnKey="item_description"
                                                                cell={({ rowIndex, columnKey, ...props }) =>
                                                                    <Cell {...props}>
                                                                        {filteredMatchedData[rowIndex][columnKey]}
                                                                    </Cell>}
                                                                fixed={true}
                                                                width={300}
                                                            />
                                                            <Column
                                                                header={<Cell>Quantity</Cell>}
                                                                columnKey="quantity"
                                                                cell={({ rowIndex, columnKey, ...props }) =>
                                                                    <Cell {...props}>
                                                                        {filteredMatchedData[rowIndex][columnKey]}
                                                                    </Cell>}
                                                                fixed={true}
                                                                width={100}
                                                            />
                                                            {/*<Column
                                                             header={<Cell>Name</Cell>}
                                                             columnKey="Name"
                                                             cell={({ rowIndex, columnKey, ...props }) =>
                                                             <Cell {...props}>
                                                             {filteredMatchedData[rowIndex][columnKey]}
                                                             </Cell>}
                                                             fixed={true}
                                                             width={200}
                                                             />*/}
                                                        </Table>
                                                    </div>
                                                    :processing?
                                                        <div>
                                                            <Loading/>
                                                            {this.state.processingProgress}
                                                        </div>:
                                                        <div>No files processed yet!</div>
                                            }

                                        </div>
                                    </TabPane>
                                </Tabs>: <div>{errorMessage}</div>
                        }
                    </div>
                    <div>
                        {
                            !errorProcessing && compareBy=='others'?
                                <div>
                                    {
                                        filteredFuzzyMatchedData.length>0?
                                            <div style={{margin: 25}}>
                                                <div style={{marginBottom: 15}}>
                                                    <b>Number of records:</b> {filteredFuzzyMatchedData.length >= 1000 ? 'More than a 1000' : filteredFuzzyMatchedData.length}
                                                </div>
                                                <div style={{marginBottom: 15}}>
                                                    <a style={{marginLeft: 5}} target="_blank" href={FLASK_APP_URL+'/data/'+fuzzyMatchedFileName}>Download in excel format (All records)</a>
                                                </div>
                                                <div style={{marginBottom: 15}}>
                                                    <b><b>Showing the {filteredFuzzyMatchedData.length >= 1000 ? ' first 1000 ' : filteredFuzzyMatchedData.length} records!</b></b>
                                                </div>
                                                <Input.Search
                                                    placeholder="Filter by Customer Name"
                                                    onSearch={this._filterFuzzyMatched.bind(this,'customer_name')}
                                                    style={{ width: 200 }}
                                                />
                                                <span style={{display: 'inline-block',width: 100}}/>
                                                <Input.Search
                                                    placeholder="Filter by Passport"
                                                    //onSearch={this._filterFuzzyMatched.bind(this, _.contains(otherCompareList, 'passport_number')?'passport_number_left':'passport_number')}
                                                    onSearch={this._filterFuzzyMatched.bind(this,'passport_number_left')}
                                                    style={{ width: 200 }}
                                                />
                                                <Input.Search
                                                    placeholder="Filter by Item"
                                                    onSearch={this._filterFuzzyMatched.bind(this, 'item_description')}
                                                    style={{ width: 300 }}
                                                />
                                                <Table
                                                    rowHeight={50}
                                                    rowsCount={filteredFuzzyMatchedData.length}
                                                    width={1100}
                                                    height={500}
                                                    headerHeight={50}
                                                    data={filteredFuzzyMatchedData}
                                                >
                                                    <Column
                                                        header={<Cell>Customer Name</Cell>}
                                                        columnKey="customer_name"
                                                        cell={({ rowIndex, columnKey, ...props }) =>
                                                            <Cell {...props}>
                                                                {filteredFuzzyMatchedData[rowIndex][columnKey]}
                                                            </Cell>}
                                                        fixed={true}
                                                        width={200}
                                                    />
                                                    <Column
                                                        header={<Cell>Flight No</Cell>}
                                                        columnKey={'flight_number_left'}
                                                        cell={({ rowIndex, columnKey, ...props }) =>
                                                            <Cell {...props}>
                                                                {filteredFuzzyMatchedData[rowIndex][columnKey]}
                                                            </Cell>}
                                                        fixed={true}
                                                        width={100}
                                                    />
                                                    <Column
                                                        header={<Cell>Passport</Cell>}
                                                        columnKey={'passport_number_left'}
                                                        cell={({ rowIndex, columnKey, ...props }) =>
                                                            <Cell {...props}>
                                                                {filteredFuzzyMatchedData[rowIndex][columnKey]}
                                                            </Cell>}
                                                        fixed={true}
                                                        width={200}
                                                    />
                                                    <Column
                                                        header={<Cell>Item Desc</Cell>}
                                                        columnKey="item_description"
                                                        cell={({ rowIndex, columnKey, ...props }) =>
                                                        {
                                                            return <Cell {...props}>
                                                                {filteredFuzzyMatchedData[rowIndex][columnKey]}
                                                            </Cell>
                                                        }
                                                        }
                                                        fixed={true}
                                                        width={300}
                                                    />
                                                    <Column
                                                        header={<Cell>Quantity</Cell>}
                                                        columnKey="quantity"
                                                        cell={({ rowIndex, columnKey, ...props }) =>
                                                            <Cell {...props}>
                                                                {filteredFuzzyMatchedData[rowIndex][columnKey]}
                                                            </Cell>}
                                                        fixed={true}
                                                        width={100}
                                                    />
                                                    <Column
                                                         header={<Cell>Match Score</Cell>}
                                                         columnKey="best_match_score"
                                                         cell={({ rowIndex, columnKey, ...props }) =>
                                                         <Cell {...props}>
                                                         {filteredFuzzyMatchedData[rowIndex][columnKey]}
                                                         </Cell>}
                                                         fixed={true}
                                                         width={200}
                                                     />
                                                </Table>
                                            </div>
                                            :processing?<Loading/>:<div>No files processed yet!</div>
                                    }

                                </div>:<div>{errorMessage}</div>
                        }
                    </div>

                </Content>
            </Layout>
        )
    }

    _goNext(current){
        if(current ==0){
            if(this.state.formCFile){
               this.next();
            }
            else{
                alert("Please upload the Form C file before proceeding");
                return;
            }
        }
        else if (current == 1){
            if(this.state.apisFile){
                this.next();
            }
            else{
                alert("Please upload the APIS file before proceeding");
                return;
            }
        }
    }

    _onOtherCompareListChange(checkedList){
        this.setState({
            otherCompareList: checkedList
        })
    }

    _onCompareByChange(e){
        console.log('radio checked', e.target.value);
        this.setState({
            compareBy: e.target.value,
        });
    }

    _filterMatched(key, value){
        const {matchedData} = this.state;
        if(!value || value==""){
            this.setState({
                filteredMatchedData: matchedData
            })
            return;
        }
        let filterBy = value.toLowerCase();
        let filteredMatchedData = matchedData.filter((row) => {
            return row[key].toLowerCase().indexOf(filterBy) !== -1
        })
        //console.log("Filtered MNatched:", filteredMatchedData);
        if(filteredMatchedData.length==0){
            filteredMatchedData = matchedData
        }
        this.setState({
            filteredMatchedData
        });
    }

    _filterFuzzyMatched(key, value){
        const {fuzzyMatchedData} = this.state;
        if(!value || value==""){
            this.setState({
                filteredFuzzyMatchedData: fuzzyMatchedData
            })
            return;
        }
        let filterBy = value.toLowerCase();
        let filteredFuzzyMatchedData = fuzzyMatchedData.filter((row) => {
            return row[key].toLowerCase().indexOf(filterBy) !== -1
        })
        if(filteredFuzzyMatchedData.length==0){
            filteredFuzzyMatchedData = fuzzyMatchedData
        }
        this.setState({
            filteredFuzzyMatchedData
        });
    }

    _filterUnmatched(key, value){
        const {unmatchedData} = this.state;
        if(!value || value==""){
            this.setState({
                filteredUnmatchedData: unmatchedData
            })
            return;
        }
        let filterBy = value.toLowerCase();
        let filteredUnmatchedData = unmatchedData.filter((row) => {
            return row[key].toLowerCase().indexOf(filterBy) !== -1
        })
        if(filteredUnmatchedData.length==0){
            filteredUnmatchedData = unmatchedData
        }
        this.setState({
            filteredUnmatchedData
        });
    }

    _process(e){
        if(this.state.compareBy == "others"){
            this._compareByOthers(e)
        }
        else{
            this._compareByPassport(e)
        }
    }

    _compareByPassport(e){
        e.preventDefault();
        let self = this;
        self.setState({
            processing: true,
            errorProcessing: false,
            errorMessage: "",
            matchedData:[],
            filteredMatchedData: [],
            unmatchedData: [],
            filteredUnmatchedData: []
        })
        fetch(FLASK_APP_URL, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin':'*'
            },
            body: JSON.stringify({
                'apisFile': this.state.apisFile,
                'formCFile': this.state.formCFile
            }),
        }).then((res) => res.text())
            .then((data)=> {
                //let rows = JSON.parse(data)
                //console.log(typeof(data));
                data = JSON.parse(data);
                //console.log("Data:", data)
                //console.log(typeof(JSON.parse(data.matched)))
                if(data.error){
                    console.log("Something went wrong processing data:", data.errorMessage)
                    self.setState({
                        errorProcessing: true,
                        errorMessage: data.errorMessage,
                        processing: false,
                        matchedData: [],
                        unmatchedData: [],
                        filteredUnmatchedData: [],
                        filteredMatchedData: []
                    })
                }
                else{
                    console.log("Processing successful")
                    let matchedData = JSON.parse(data.matched);
                    let unmatchedData = JSON.parse(data.unmatched);
                    self.setState({
                        errorProcessing: false,
                        errorMessage: "",
                        processing: false,
                        matchedData: matchedData,
                        filteredMatchedData: matchedData,
                        unmatchedData: unmatchedData,
                        filteredUnmatchedData: unmatchedData,
                        matchedFileName: data.matchedFileName,
                        unmatchedFileName: data.unmatchedFileName
                    })
                }
            })
            .catch((err) => {
                    self.setState({
                        processing: false,
                        errorProcessing: true,
                        errorMessage: `An error occurred processing the files (compare by passport): ${JSON.stringify(err)}`
                    })
                    console.log("Fetch err", err)
                }
            );
    }


    _compareByOthers(e){
        e.preventDefault();
        let self = this;
        if(this.state.otherCompareList.length == 0){
            alert("Choose at least one parameter to compare by")
            return
        }
        self.setState({
            processing: true,
            errorProcessing: false,
            errorMessage: "",
            fuzzyMatchedData:[],
            filteredFuzzyMatchedData: [],
        })
        let flaskURL = FLASK_APP_URL+'/fuzzy'
        fetch(flaskURL, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin':'*'
            },
            body: JSON.stringify({
                'apisFile': this.state.apisFile,
                'formCFile': this.state.formCFile,
                'otherCompareList': this.state.otherCompareList
            }),
        }).then((res) => res.text())
            .then((data)=> {
                //let rows = JSON.parse(data)
                //console.log(typeof(data));
                data = JSON.parse(data);
                //console.log("Data:", data)
                //console.log(typeof(JSON.parse(data.matched)))
                if(data.error){
                    console.log("Something went wrong processing data:", data.errorMessage)
                    self.setState({
                        errorProcessing: true,
                        errorMessage: data.errorMessage,
                        processing: false,
                        fuzzyMatchedData: [],
                        filteredFuzzyMatchedData: []
                    })
                }
                else{
                    console.log("Processing successful")
                    let fuzzyMatchedData = JSON.parse(data.fuzzyMatched);
                    self.setState({
                        errorProcessing: false,
                        errorMessage: "",
                        processing: false,
                        fuzzyMatchedData: fuzzyMatchedData,
                        filteredFuzzyMatchedData: fuzzyMatchedData,
                        fuzzyMatchedFileName: data.fuzzyMatchedFileName
                    })
                }
            })
            .catch((err) => {
                    self.setState({
                        processing: false,
                        errorProcessing: true,
                        errorMessage: `An error occurred processing the files: ${JSON.stringify(err)}`
                    })
                    console.log("Fetch err", err)
                }
            );
    }

    _uploadApisFile(e){
        e.preventDefault();
        var self = this;
        var file = document.getElementById("fileApis").files[0];
        if(!file){
            return
        }
        var fileName = file.name; //Should be 'picture.jpg'
        if(!this._isExcel(fileName)){
            alert("File doesn't have .xlsx extension. Is this a valid excel file?");
            return;
        }
        self.setState({
            uploadingApis: true
        })
        message.info("File Upload started!")
        var fd = new FormData();
        fd.append('data', file)
        $.ajax({
            url: Environment.GCOOL_FILE_ENDPOINT,
            data: fd,
            type: 'POST',
            // THIS MUST BE DONE FOR FILE UPLOADING
            contentType: false,
            processData: false,
            // ... Other options like success and etc
            success: function(data){
                console.log("UPLOAD SUCCESS:", data);
                let file = JSON.parse(data);
                //console.log(file);
                message.success("APIS file uploaded successfully!")
                self.setState({
                    uploadingApis: false,
                    apisFile: file.url
                })
            },
            error: function(data){
                console.log("UPLOAD ERRRRRR:",data)
                message.error("Error uploading APIS file")
                self.setState({
                    uploadingApis: false
                })
            },
            xhr: function(){
                var xhr = new window.XMLHttpRequest();
                // Handle progress
                //Upload progress
                xhr.upload.addEventListener("progress", function(evt){
                    if (evt.lengthComputable) {
                        var percentComplete = (evt.loaded / evt.total) * 100;
                        //Do something with upload progress
                        self.setState({
                            apisFileUploadProgress: parseFloat(percentComplete.toFixed(2))
                        })
                    }
                }, false);
                return xhr;
            },
            complete:function(){
                console.log("Upload APIS file request finished.");
            }
        })
    }

    _uploadFormCFile(e){
        e.preventDefault();
        var self = this;
        var file = document.getElementById('fileFormC').files[0];
        if(!file){
            return
        }
        var fileName = file.name; //Should be 'picture.jpg'
        if(!this._isExcel(fileName)){
            alert("File doesn't have .xlsx extension. Is this a valid excel file?");
            return;
        }
        self.setState({
            uploadingFormC: true
        })
        message.info("File Upload started!")
        var fd = new FormData();
        fd.append('data', file)
        $.ajax({
            url: Environment.GCOOL_FILE_ENDPOINT,
            data: fd,
            type: 'POST',
            // THIS MUST BE DONE FOR FILE UPLOADING
            contentType: false,
            processData: false,
            // ... Other options like success and etc
            success: function(data){
                console.log("UPLOAD SUCCESS:", data);
                let file = JSON.parse(data);
                //console.log(file);
                message.success("FormC file uploaded successfully!")
                self.setState({
                    uploadingFormC: false,
                    formCFile: file.url
                })
            },
            error: function(data){
                console.log("UPLOAD ERRRRRR:",data)
                message.error("Error uploading FormC file")
                self.setState({
                    uploadingFormC: false
                })
            },
            xhr: function(){
                var xhr = new window.XMLHttpRequest();
                // Handle progress
                //Upload progress
                xhr.upload.addEventListener("progress", function(evt){
                    if (evt.lengthComputable) {
                        var percentComplete = (evt.loaded / evt.total) * 100;
                        //Do something with upload progress
                        self.setState({
                            formCFileUploadProgress: parseFloat(percentComplete.toFixed(2))
                        })
                    }
                }, false);
                return xhr;
            },
            complete:function(){
                console.log("Upload Form C file request finished.");
            }
        })
    }

    _isExcel(fileName){
        let parts = fileName.split('.');
        let ext = parts[parts.length - 1];
        if(ext != 'xlsx'){
            return false
        }
        return true;
    }

    _validateFileHeaders(file, fileHeaders){
        var fileReader = new FileReader();
        let self = this;
        fileReader.onload = function (e) {
            var filename = file.name;
            // pre-process data
            var binary = "";
            var bytes = new Uint8Array(e.target.result);
            var length = bytes.byteLength;
            for (var i = 0; i < length; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            // call 'xlsx' to read the file
            var oFile = XLSX.read(binary, {type: 'binary', cellDates:true, cellStyles:true});
            //console.log("File:", oFile)
            let sheet = oFile.Sheets[Object.keys(oFile.Sheets)[0]]
            //console.log(sheet);
            let headers = self.getHeaderRow(sheet);
            console.log("Headers:", headers);
            let valid = _.isEqual(fileHeaders, headers)
            //console.log("Valid:", valid)
            return valid;
        };
        fileReader.readAsArrayBuffer(file);
    }

    getHeaderRow(sheet) {
        var headers = [];
        var range = XLSX.utils.decode_range(sheet['!ref']);
        var C, R = range.s.r; /* start in the first row */
        /* walk every column in the range */
        for(C = range.s.c; C <= range.e.c; ++C) {
            var cell = sheet[XLSX.utils.encode_cell({c:C, r:R})] /* find the cell in the first row */

            var hdr = "UNKNOWN " + C; // <-- replace with your desired default
            if(cell && cell.t) hdr = XLSX.utils.format_cell(cell);

            headers.push(hdr);
        }
        return headers;
    }
}


