export const cssOverrides = `

  .button--padding-large {
    padding: 0.74rem 1rem;
    border-radius: 4px;
    height:36px!important;
  }


  .evm-network-control__container span {
    display: none
  }
  .account-control__container img {
    display: none
  }
 .dynamic-widget-inline-controls  {
  background:#FBFBFB;
  border:1px solid rgba(35, 25, 45, 0.10);
  box-shadow: 0px 1px 1px 0px rgba(0, 0, 0, 0.05);
  font-family: 'Inter Variable', sans-serif;
  border-radius: 4px;
  height:36px;
  z-index: 2;
 }
 .dynamic-widget-inline-controls:hover  {
  background:rgba(55, 22, 55, 0.03);


 }


 .dynamic-widget-inline-controls__network-picker-main > button > svg {
  display:none;
  width:0

 }

  .dynamic-widget-inline-controls__network-picker-main > button {
    border-radius:0;


  }
  .dynamic-widget-inline-controls__network-picker-main  > button:hover {
    background-color: transparent;

}
 .dynamic-widget-inline-controls__network-picker.evm-network-control__container {
width:41px;
height: 34px;



min-width:41px;

padding-right:0;
padding-inline-end:0;
 }
 .dynamic-widget-inline-controls__network-picker-main {
    min-width: 25px;

}
 .dynamic-widget-inline-controls__network-picker-main:hover {
    background-color: transparent!important;

}
 .dynamic-widget-inline-controls__network-picker-main:active {
    background-color: transparent!important;

}
 .dynamic-widget-inline-controls__network-picker.evm-network-control__container::after {
  content: "";
  display: block;
  width: 1px;
  height: 20px;
  position: absolute;
  background:#DCDBDD;
  top: 8px;
  right: 0px;
  pointer-events: none;
 }
 .account-control__container.account-control__container--multiwallet-disabled.dynamic-widget-inline-controls__account-control {

  height:31px;
  border-radius:0;
  // background:green;
 }
  .account-control__container.account-control__container--multiwallet-disabled.dynamic-widget-inline-controls__account-control:hover {
    background:transparent;
  }
  .dynamic-shadow-dom-content div {
    transform: none !important;
    z-index: 2;
  }
  .dynamic-shadow-dom-content .dynamic-widget-inline-controls__network-picker-list {
    position: fixed !important;
  }
`;
