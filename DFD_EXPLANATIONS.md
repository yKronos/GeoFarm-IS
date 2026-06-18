# Data Flow Diagram Explanations - GeoFarm-IS

The Data Flow Diagrams (DFD) for GeoFarm-IS map the movement of data through the system's major processes, organized by user role. Five separate DFDs are presented to reflect the distinct workflows of each actor: Super Admin, Agricultural Officer, Data Encoder, Farmer/Viewer, and the Predictive Analytics Module.

---

## Figure X.1. Super Admin Data Flow

The Super Admin Data Flow Diagram illustrates the highest level of system access and control within GeoFarm-IS. The Super Admin begins by providing login credentials to Process 1.0 (Login/Authentication Verification), which validates the user's identity and establishes an authenticated session. Once authenticated, the Super Admin can perform four primary administrative functions.

Process 1.1 (Manage User Accounts) enables the Super Admin to create, modify, and delete user accounts stored in data store D1 (users). This process also involves assigning roles from D2 (roles) and permissions from D3 (permissions) to users, implementing the system's role-based access control structure. The Super Admin can query these data stores to retrieve lists of users, roles, and permissions, and can update them with new assignments or modifications.

Process 1.2 (Configure System Settings) allows the Super Admin to modify system-wide configurations, such as security policies, notification settings, and operational parameters. These configuration changes are applied to the system environment to ensure optimal performance and security.

Process 1.3 (View Audit Logs) provides the Super Admin with access to data store D4 (audit_logs), which contains a comprehensive record of all system activities, including user actions, data modifications, and system events. The Super Admin can query this data store to retrieve audit trail data for monitoring, compliance, and security purposes.

Process 1.4 (Manage Lookup Tables) enables the Super Admin to maintain reference data used throughout the system. This includes managing crop types in D5 (crops), farm classifications in D6 (farm_types), livestock categories in D7 (livestock_types), and assistance program types in D8 (assistance_types). The Super Admin can add, update, or remove entries in these lookup tables, ensuring that the system's reference data remains current and accurate.

The Super Admin role is critical for system governance, security management, and data integrity, as it controls user access, monitors system activities, and maintains the foundational reference data that supports all other system operations.

---

## Figure X.2. Agricultural Officer Data Flow

The Agricultural Officer Data Flow Diagram represents the core operational workflows for managing agricultural data and programs within GeoFarm-IS. Agricultural Officers are the primary users responsible for farmer registration, parcel management, seasonal tracking, livestock inventory, assistance program administration, and report generation.

The workflow begins with Process 2.0 (Login/Authentication), where the Agricultural Officer provides login credentials to establish an authenticated session. Once authenticated, the officer can access seven major functional areas.

Process 2.1 (Manage Farmer Registry) allows the officer to create, update, and view farmer profiles stored in data store D9 (farmers). This includes entering personal information, RSBSA numbers, contact details, and generating QR codes for farmer identification. The process retrieves the list of registered farmers from D9 and sends updated farmer details back to the data store.

Process 2.2 (Manage Farm Parcels) enables the officer to register and update farm parcel information in data store D10 (farm_parcels). This includes recording parcel locations using GPS coordinates, storing spatial data in GeoJSON format, specifying land area, ownership type, and farm classification. The process retrieves existing parcel records and updates them with new or modified information.

Process 2.3 (Record Seasonal Data) captures crop production information across dry and wet seasons. The officer enters planting dates, harvest dates, crop types, area planted, yield volumes, and input costs into data store D11 (crop_seasons). This historical data is essential for tracking agricultural productivity and supporting predictive analytics.

Process 2.4 (Manage Livestock Inventory) allows the officer to record and update livestock holdings for each farmer. This process interacts with multiple data stores: D12 (livestock) for general livestock records, D13 (tree_crops) for perennial crops, and D14 (fishponds) for aquaculture data. The officer can enter livestock counts, health status, vaccination records, and other relevant details.

Process 2.5 (Manage Assistance Programs) enables the officer to create and administer financial assistance programs. This process interacts with D15 (financial_assistance) to store program details, D16 (assistance_distributions) to record individual farmer distributions, and D17 (barangays) to manage barangay-level allocations. The officer can track distribution status (pending, claimed, forfeited) and monitor program implementation.

Process 2.6 (View GIS Maps) retrieves spatial data from D10 (farm_parcels) to render interactive maps showing farmer land locations, crop distribution, and livestock density across the municipality. This visualization capability supports spatial analysis and planning.

Process 2.7 (Generate Reports) compiles data from multiple data stores to produce comprehensive reports in PDF or Excel format. These reports may include farmer demographics, crop production summaries, livestock inventories, and assistance program statistics. The generated reports are returned to the Agricultural Officer for review and distribution.

The Agricultural Officer role is central to the system's operational effectiveness, as it bridges data collection, program management, and decision support functions.

---

## Figure X.3. Data Encoder Data Flow

The Data Encoder Data Flow Diagram illustrates the data entry and record management workflows performed by staff members responsible for maintaining accurate and up-to-date information in GeoFarm-IS. Data Encoders have focused access to data entry functions without administrative or analytical privileges.

The workflow begins with Process 3.0 (Login/Authentication), where the Data Encoder provides login credentials to establish an authenticated session with restricted permissions appropriate to their role.

Process 3.1 (Register Farmers) allows the Data Encoder to input new farmer registration data into data store D9 (farmers). This includes entering personal information, RSBSA numbers, contact details, addresses, and demographic data. The process also triggers QR code generation for each registered farmer, which is stored as part of the farmer profile. The Data Encoder can retrieve the list of existing farmers to verify records and avoid duplicate entries.

Process 3.2 (Encode Farm Parcels) enables the Data Encoder to input farm parcel information into data store D10 (farm_parcels). This includes recording parcel numbers, location addresses, GPS coordinates collected during field surveys, land area measurements, ownership types, and farm classifications. The spatial data is stored in both geometry and GeoJSON formats to support GIS mapping functionality.

Process 3.3 (Record Crop Production) allows the Data Encoder to enter seasonal crop data into data store D11 (crop_seasons). This includes specifying the season (dry or wet), cropping year, crop type, area planted, planting and harvest dates, yield volumes, and input costs (seeds, fertilizer, labor). This historical production data is critical for trend analysis and predictive modeling.

Process 3.4 (Update Livestock Data) enables the Data Encoder to record livestock inventory information in data store D12 (livestock). This includes entering livestock types, breeds, head counts, health status, vaccination dates, and raising purposes (meat, dairy, breeding). The Data Encoder can update existing records as livestock populations change over time.

Process 3.5 (Record Agricultural Assets) allows the Data Encoder to input data on various agricultural assets beyond traditional crops and livestock. This process interacts with multiple specialized data stores: D13 (tree_crops) for perennial fruit and timber trees, D14 (fishponds) for aquaculture operations, D18 (large_ruminants) for cattle and carabao, D19 (small_ruminants) for goats and sheep, D20 (native_pigs), D21 (swine_hybrid) for commercial pig breeds, and D22 (poultry) for chickens, ducks, and other fowl. This comprehensive asset tracking supports holistic agricultural planning and resource management.

The Data Encoder role ensures that the system's database remains current and accurate through systematic data entry and record maintenance, providing the foundation for all analytical and reporting functions.

---

## Figure X.4. Farmer/Viewer Data Flow

The Farmer/Viewer Data Flow Diagram represents the read-only access workflows available to farmers and other stakeholders who need to view agricultural information without the ability to modify system data. This role provides transparency and enables farmers to monitor their own records and assistance status.

The workflow begins with Process 4.0 (Login/Authentication), where the Farmer or Viewer provides login credentials to establish an authenticated session with read-only permissions.

Process 4.1 (View Farmer Profile) retrieves farmer profile data from data store D9 (farmers) and displays it to the user. This includes personal information, RSBSA number, contact details, address, and the farmer's QR code. Farmers can verify that their information is accurate and up-to-date, though they cannot modify it directly.

Process 4.2 (View Farm Parcels) retrieves parcel information from data store D10 (farm_parcels) and displays it to the user. This includes parcel locations, land area, ownership type, and farm classification. The process may also render a map view showing the spatial location of the farmer's parcels, providing visual confirmation of land boundaries.

Process 4.3 (View Crop History) retrieves seasonal crop records from data store D11 (crop_seasons) and displays historical production data. Farmers can review their past planting and harvest activities, yields, and input costs across multiple seasons, enabling them to track their own agricultural performance over time.

Process 4.4 (View Livestock Inventory) retrieves livestock data from data store D12 (livestock) and displays current livestock holdings. Farmers can view their recorded livestock counts, types, breeds, and health status, ensuring transparency in inventory records.

Process 4.5 (Check Assistance Status) retrieves distribution records from data store D16 (assistance_distributions) and displays the farmer's assistance program participation. This includes information on programs they are enrolled in, distribution dates, quantities or amounts received, and claim status (pending, claimed, forfeited). This transparency helps farmers track their benefits and plan accordingly.

Process 4.6 (View Reports) retrieves pre-generated reports from data store D23 (reports) and displays them in read-only format. These may include summary reports, statistical analyses, or program updates relevant to the farmer or viewer.

All data flows in this diagram are unidirectional from data stores to processes, reflecting the read-only nature of the Farmer/Viewer role. This design ensures data security while providing stakeholders with visibility into their own records and program participation.

---

## Figure X.5. Predictive Analytics Module Data Flow

The Predictive Analytics Module Data Flow Diagram illustrates the automated data processing workflows that enable GeoFarm-IS to identify farmers at risk of financial losses and provide early warning alerts to Agricultural Officers. This module represents the system's decision support capabilities.

Process 5.0 (Crop Yield Estimator) serves as the entry point for predictive analytics. This process is typically triggered by Agricultural Officers who wish to estimate potential yields for upcoming seasons or assess farmer risk levels.

Process 5.1 (Analyze Historical Data) retrieves and processes data from multiple sources. From data store D11 (crop_seasons), it extracts historical yield data, input costs, planting dates, and harvest dates for specific crops and farmers. From D10 (farm_parcels), it retrieves parcel area and location information. From D24 (crops), it obtains crop-specific requirements such as optimal seeding rates, fertilizer rates, temperature ranges, rainfall requirements, and soil pH preferences. This process aggregates and normalizes the data to prepare it for statistical analysis.

Process 5.2 (Calculate Yield Predictions) applies statistical algorithms to the processed historical data to estimate expected yields for specified crop types and land areas. The calculation considers factors such as average yield per hectare from past seasons, seasonal variations (dry vs. wet), and crop-specific growth requirements. The process generates yield estimates and confidence intervals based on the quality and quantity of available historical data.

Process 5.3 (Identify At-Risk Farmers - Palugi Detection) analyzes yield-to-input cost ratios across consecutive seasons to identify farmers whose production trends indicate potential financial losses. The process applies threshold-based rules to flag farmers whose yields are declining, whose input costs are rising disproportionately, or whose profit margins are approaching or below break-even levels. The risk assessment results are stored in data store D25 (predictions) for future reference and trend analysis.

Process 5.4 (Generate Recommendations) compiles the risk assessment results into actionable alerts and recommendations. For farmers identified as at-risk, the process generates early warning notifications that are sent to Agricultural Officers. These alerts may include suggested interventions such as technical assistance, input subsidies, crop diversification advice, or enrollment in assistance programs. The recommendations are based on the specific risk factors identified for each farmer.

The predictive analytics module also feeds data into the system's reporting functions, enabling Agricultural Officers to generate predictive analytics reports that summarize risk trends, forecast production volumes, and support evidence-based policy decisions.

This module transforms raw agricultural data into actionable intelligence, enabling proactive rather than reactive support for farmers facing financial challenges. By identifying at-risk farmers early, the system supports timely interventions that can prevent losses and improve agricultural resilience.

---

## Summary

The five Data Flow Diagrams collectively illustrate how GeoFarm-IS manages data across different user roles and functional modules. The Super Admin DFD focuses on system governance and security, the Agricultural Officer DFD covers core operational workflows, the Data Encoder DFD emphasizes data entry and maintenance, the Farmer/Viewer DFD provides transparency through read-only access, and the Predictive Analytics Module DFD demonstrates the system's decision support capabilities. Together, these diagrams provide a comprehensive view of data movement, processing, and storage within the GeoFarm-IS architecture.
