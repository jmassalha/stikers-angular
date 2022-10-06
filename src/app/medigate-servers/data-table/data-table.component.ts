import { HttpClient } from "@angular/common/http";
import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { int } from "@zxing/library/esm/customTypings";

export interface DialogData {
    selectedData: string;
    dataType: string;
}
export interface TableData {
    network_list: string;
    device_category: string;
    device_subcategory: string;
    device_type: string;
    uid: string;
    asset_id: string;
    mac_list: string;
    ip_list: string;
    risk_score: string;
    device_type_family: string;
    model: string;
    os_category: string;
    serial_number: string;
    vlan_list: string;
    retired: string;
    labels: string;
    assignees: string;
    hw_version: string;
    os_name: string;
    os_version: string;
    os_revision: string;
    combined_os: string;
    endpoint_security_names: string;
    equipment_class: string;
    consequence_of_failure: string;
    management_services: string;
    infection_status: string;
    mdm_ownership: string;
    mdm_enrollment_status: string;
    mdm_compliance_status: string;
    last_domain_user: string;
    fda_class: string;
    mobility: string;
    purdue_level: string;
    dhcp_hostnames: string;
    http_hostnames: string;
    snmp_hostnames: string;
    windows_hostnames: string;
    other_hostnames: string;
    ae_titles: string;
    dhcp_fingerprint: string;
    note: string;
    domains: string;
    battery_level: string;
    financial_cost: string;
    machine_type: string;
    phi: string;
    cmms_asset_tag: string;
    avg_in_use_per_day: string;
    avg_online_per_day: string;
    avg_examinations_per_day: string;
    mac_oui_list: string;
    ip_assignment_list: string;
    vlan_name_list: string;
    vlan_description_list: string;
    connection_type_list: string;
    ssid_list: string;
    bssid_list: string;
    ap_name_list: string;
    ap_location_list: string;
    switch_mac_list: string;
    switch_ip_list: string;
    switch_name_list: string;
    switch_port_list: string;
    switch_location_list: string;
    switch_port_description_list: string;
    wlc_name_list: string;
    wlc_location_list: string;
    last_domain_user_activity: string;
    last_scan_time: string;
    edr_last_scan_time: string;
    retired_since: string;
    utilization_rate: string;
    activity_rate: string;
    os_eol_date: string;
    last_seen_list: string;
    first_seen_list: string;
    wifi_last_seen_list: string;
    last_seen_on_switch_list: string;
    is_online: string;
    network_scope_list: string;
    manufacturer: string;
    site_name: string;
    switch_group_name_list: string;
    switch_device_type_list: string;
    cmdb_asset_tag: string;
    infected: string;
    managed_by: string;
    authentication_user_list: string;
}
@Component({
    selector: "app-data-table",
    templateUrl: "./data-table.component.html",
    styleUrls: ["./data-table.component.css"],
})
export class DataTableComponent implements OnInit {
    constructor(
        public dialogRef: MatDialogRef<DataTableComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private http: HttpClient
    ) {}
    
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    displayedColumns: string[] = [
        "ip_list",
        "mac_list",
        "network_list",
        "device_category",
        "device_subcategory",
        "manufacturer",
        "device_type",
        "os_version",
        "vlan_list",
    ];
    TABLE_DATA: TableData[] = [];
    dataSource = new MatTableDataSource(this.TABLE_DATA);
    resultsLength = 0;
    ngOnInit(): void {
        console.log(this.data.selectedData[0]);
        switch (this.data.dataType) {
            case "ManufacturerDistribution":
                this.GetManufacturerDistribution();
                break;
            case "InventoryHighLevelStats":
                this.GetInventoryHighLevelStats();
                break;
            case "DeviceTypeFamilyDistribution":
                this.GetDeviceTypeFamilyDistribution();
                break;
        }
    }
    GetDeviceTypeFamilyDistribution() {
        // debugger
        this.http
            .post(
                "http://srv-apps-prod/RCF_WS/WebService.asmx/GetDeviceTypeFamilyDistributionByName",
                //"http://srv-apps-prod/RCF_WS/WebService.asmx/GetDeviceTypeFamilyDistributionByName",
                {
                    ManufacturerDistribution: this.data.selectedData,
                }
            )
            .subscribe((Response) => {
                //debugger
                this.TABLE_DATA.splice(0, this.TABLE_DATA.length);
                this.TABLE_DATA = Response['d']
                this.dataSource = new MatTableDataSource<any>(this.TABLE_DATA);
                this.dataSource.paginator = this.paginator;
                this.resultsLength = this.TABLE_DATA.length;
            });
    }
    GetInventoryHighLevelStats() {
        // debugger
        this.http
            .post(
                "http://srv-apps-prod/RCF_WS/WebService.asmx/GetInventoryHighLevelStatsByName",
                //"http://srv-apps-prod/RCF_WS/WebService.asmx/GetInventoryHighLevelStatsByName",
                {
                    ManufacturerDistribution: this.data.selectedData,
                }
            )
            .subscribe((Response) => {
                //debugger
                this.TABLE_DATA.splice(0, this.TABLE_DATA.length);
                this.TABLE_DATA = Response['d']
                this.dataSource = new MatTableDataSource<any>(this.TABLE_DATA);
                this.dataSource.paginator = this.paginator;
                this.resultsLength = this.TABLE_DATA.length;
            });
    }
    GetManufacturerDistribution() {
        // debugger
        this.http
            .post(
                "http://srv-apps-prod/RCF_WS/WebService.asmx/GetManufacturerDistributionByName",
                //"http://srv-apps-prod/RCF_WS/WebService.asmx/GetManufacturerDistributionByName",
                {
                    ManufacturerDistribution: this.data.selectedData[0],
                }
            )
            .subscribe((Response) => {
                //debugger
                this.TABLE_DATA.splice(0, this.TABLE_DATA.length);
                this.TABLE_DATA = Response['d']
                this.dataSource = new MatTableDataSource<any>(this.TABLE_DATA);
                this.dataSource.paginator = this.paginator;
                this.resultsLength = this.TABLE_DATA.length;
            });
    }
    applyFilter(event) {
      const filterValue = event;
      this.dataSource.filter = filterValue.trim().toLowerCase(); 
    }
}
