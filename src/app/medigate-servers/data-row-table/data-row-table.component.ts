import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
export interface DialogData {
  row: string;
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
  selector: 'app-data-row-table',
  templateUrl: './data-row-table.component.html',
  styleUrls: ['./data-row-table.component.css']
})
export class DataRowTableComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,) { 
      console.log(data.row)
    }

  ngOnInit(): void {
  }

}
