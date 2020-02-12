import React from 'react';
import "./recepit.css";
import Html2Pdf from 'js-html2pdf';
import Utils from '../../app/common/utils';
import logo from '../../assets/images/bijak_logo.png';
// const $ = window["jQuery"];
var moment = require('moment');

const formatDateAndTime = (dateval) => {
    var fdate = moment.utc(new Date(dateval)).format('DD-MMM-YYYY HH:mm A')
    return <div style={{ display: "inline-block" }}> {fdate.split(" ")[0] + ", " + fdate.split(" ")[1] + " " + fdate.split(" ")[2]}</div>
}

let bijakReceipt = {
    getReceipt: function (transactionInfoData) {

        console.log(transactionInfoData);
        return (
            <div id="recepit_content" className="receipt_container">
                <div className="receipt_main">
                    <div className="header">
                        <img src={logo}
                            alt="logo" height="52px" />
                        <span className="logo_title">  KrishiAcharya Technologies Private Limited</span>
                    </div>

                    <div className="transaction_date">
                        <div className="transdatelabel">Transaction Date</div>
                        <div className="transdate" > {transactionInfoData["createdtime"] ? formatDateAndTime(transactionInfoData["createdtime"]) : ""}</div>
                    </div>

                    <hr className="h_divider"></hr>

                    <div className="table_container">
                        <table className="order_table">
                            <tr>
                                <th className="headings">ORDER ID</th>
                                <th className="headings">PAYMENT ID</th>
                                <th className="headings">INVOICE NUMBER</th>
                                <th className="headings">AMOUNT</th>
                            </tr>
                            <tr>
                                <td className="order_info_cell">{transactionInfoData["pay_data"]["related_order_id"] ? transactionInfoData["pay_data"]["related_order_id"] : "-"} 
                                        {transactionInfoData["internal_reference_number"] ? " (#"+transactionInfoData["internal_reference_number"] +")": ""}
                                </td>
                                <td className="order_info_cell">{transactionInfoData["pay_id"] ? transactionInfoData["pay_id"] : "-"}</td>
                                <td className="order_info_cell">{transactionInfoData["invoive_no"] ? transactionInfoData["invoive_no"] : "-"}</td>
                                <td className="order_info_cell highlighted">₹ {transactionInfoData["amount"] ? Utils.formatNumberWithComma(transactionInfoData["amount"]) : "-"}</td>
                            </tr>
                        </table>
                    </div>

                    <hr className="h_divider"></hr>

                    <div className="table_container">
                        <table className="order_table">
                            <tr>
                                <th className="headings">SENDER DETAILS</th>
                                <th className="headings">BENEFICIERY DETAILS</th>
                            </tr>
                            <tr>
                                <td className="sender_info_cell highlighted">{transactionInfoData["buyer_fullname"] ? transactionInfoData["buyer_fullname"] : "-"}</td>
                                <td className="sender_info_cell highlighted"> {transactionInfoData["supplier_fullname"] ? transactionInfoData["supplier_fullname"] : "-"} </td>
                            </tr>
                            <tr>
                                <td className="sender_info_cell fs14">{transactionInfoData["buyer_business_name"] ? transactionInfoData["buyer_business_name"] : "-"},
                                <div>{transactionInfoData["buyer_locality"] ? transactionInfoData["buyer_locality"] + "," : " "}</div>
                                    <div>{transactionInfoData["buyer_district"] ? transactionInfoData["buyer_district"] + "," : " "}  {transactionInfoData["buyer_state"] ? transactionInfoData["buyer_state"] + "," : " "} </div>
                                    <div>{transactionInfoData["buyer_mobile"] ? transactionInfoData["buyer_mobile"] : "-"}</div>
                                </td>
                                <td className="sender_info_cell fs14">
                                    {transactionInfoData["supplier_business_name"] ? transactionInfoData["supplier_business_name"] : "-"},
                                    <div>{transactionInfoData["supplier_locality"] ? transactionInfoData["supplier_locality"] + "," : " "}</div>
                                    <div>{transactionInfoData["supplier_district"] ? transactionInfoData["supplier_district"] + "," : " "}  {transactionInfoData["supplier_state"] ? transactionInfoData["supplier_state"] + "," : " "} </div>
                                    <div>{transactionInfoData["supplier_mobile"] ? transactionInfoData["supplier_mobile"] : "-"}</div>
                                </td>
                            </tr>
                        </table>
                    </div>

                    <hr className="h_divider"></hr>

                    <div className="payment_details">
                        <div className="headings">PAYMENT DETAILS</div>
                        <div className="payment_details_row">
                            <div className="payment_details_row_title">Payment Date</div>
                            :
                    <div className="payment_details_row_value"> {transactionInfoData["createdtime"] ? formatDateAndTime(transactionInfoData["createdtime"]) : "-"}</div>
                        </div>
                        <div className="payment_details_row">
                            <div className="payment_details_row_title">Payment Number</div>:
                    <div className="payment_details_row_value">{transactionInfoData["pay_id"] ? transactionInfoData["pay_id"] : "-"}</div>
                        </div>
                        <div className="payment_details_row">
                            <div className="payment_details_row_title">Mode of Payment</div>:
                    <div className="payment_details_row_value">{transactionInfoData["mode"] ? transactionInfoData["mode"] : "-"}</div>
                        </div>
                        <div className="payment_details_row">
                            <div className="payment_details_row_title">UTR Number</div>:
                    <div className="payment_details_row_value">{transactionInfoData["utr"] ? transactionInfoData["utr"] : "-"}</div>
                        </div>
                    </div>

                    <hr className="h_divider"></hr>

                    <div className="payment_details">
                        <div className="headings">BENEFICIERY DETAILS</div>
                        <div className="payment_details_row">
                            <div className="payment_details_row_title">Account Holders Name</div>:
                    <div className="payment_details_row_value">{transactionInfoData["bank_details"] && transactionInfoData["bank_details"]["bank_account_holder_name"] ? transactionInfoData["bank_details"]["bank_account_holder_name"] : "-"}</div>
                        </div>
                        <div className="payment_details_row">
                            <div className="payment_details_row_title">Account Number</div>:
                    <div className="payment_details_row_value">{transactionInfoData["bank_details"] && transactionInfoData["bank_details"]["bank_account_number"] ? transactionInfoData["bank_details"]["bank_account_number"] : "-"}</div>
                        </div>
                        <div className="payment_details_row">
                            <div className="payment_details_row_title">IFSC</div>:
                    <div className="payment_details_row_value" style={{ textTransform: "uppercase" }}>{transactionInfoData["bank_details"] && transactionInfoData["bank_details"]["bank_ifsc_code"] ? transactionInfoData["bank_details"]["bank_ifsc_code"] : "-"}</div>
                        </div>
                        <div className="payment_details_row">
                            <div className="payment_details_row_title">Payment Amount</div>:
                    <div className="payment_details_row_value amount">₹ {transactionInfoData["amount"] ? Utils.formatNumberWithComma(transactionInfoData["amount"]) : "-"}</div>
                        </div>
                        <div className="payment_details_row">
                            <div className="payment_details_row_title">Payment Status</div>:
                    <div className="payment_details_row_value">{transactionInfoData["status"] ? transactionInfoData["status"] : "-"}</div>
                        </div>
                    </div>
                </div>

                <div className="subfooter">
                    For any queries please contact Bijak Customer Care on <strong> +91 8860006179 </strong>
                </div>

                <div className="receipt_footer">
                    <table className="footer_table">
                        <tr>
                            <th className="footer_text">
                                <i class="fa fa-phone" aria-hidden="true"></i> &nbsp;+918860006179</th>
                            <th className="footer_text">
                                <i class="fa fa-globe" aria-hidden="true"></i>&nbsp;www.bijak.in</th>
                            <th className="footer_text">
                                <i class="fa fa-envelope" aria-hidden="true"></i>&nbsp;contact@bijak.com</th>
                            <th className="footer_text">
                                <i class="fa fa-map-marker" aria-hidden="true"></i>&nbsp;
                                90 Springboard, Sector -18, Gurgaon, Haryana</th>
                        </tr>
                    </table>
                </div>
            </div>
        )
    },

    downloadAsPdf: function (transactionInfoData) {
        try {
            let filenameOfPdf = transactionInfoData["supplier_fullname"] + '_' + transactionInfoData["createdtime"]+'.pdf';
            // https://github.com/airarrazaval/html2pdf
            var element = document.getElementById('recepit_content');
            // var options = {
            //     filename: filenameOfPdf,
            //     image: { type: 'jpeg', quality: 0.98 }
            // }
            var options = {
                filename: filenameOfPdf
              };
            var exporter = new Html2Pdf(element, options);
            // exporter.getPdf(false).then((pdf) => {
            //     console.log('downloading pdf file');
            //     pdf.save();
            // });

            exporter.getPdf(true).then((pdf) => {
                console.log('pdf file downloaded');
              });
              
            // Html2Pdf.getPdf(options);
        } catch (err) {
            console.log(err);
            alert(err)
        }
    }
}

export default bijakReceipt;
