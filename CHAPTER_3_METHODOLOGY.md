# CHAPTER 3: METHODOLOGY

## 3.1 Research Design

This study employed a developmental research design to create the GeoFarm Information System, a web-based agricultural management platform for the Municipal Agriculture Office. The development process followed the Agile Software Development methodology with iterative cycles of planning, design, implementation, testing, and evaluation.

The research utilized both qualitative and quantitative approaches:
- **Qualitative**: Gathered through interviews with agricultural officers and farmers to understand system requirements
- **Quantitative**: Collected through system performance metrics, user acceptance testing scores, and data accuracy measurements

## 3.2 Research Locale

The study was conducted at the Municipal Agriculture Office of [Municipality Name], [Province Name], Philippines. The system was designed to manage agricultural data for all barangays within the municipality, covering farmer profiles, farm parcels, crop production, livestock inventory, and assistance program distribution.

## 3.3 Respondents of the Study

The respondents of this study consisted of:

1. **Primary Users** (n=XX)
   - Municipal Agriculture Officer (1)
   - Agricultural Technicians (X)
   - Data Encoders (X)
   
2. **Secondary Users** (n=XX)
   - Barangay Agricultural Workers (X)
   - System Administrators (X)

3. **Beneficiaries**
   - Registered Farmers (XXX)
   - Barangay Officials (XX)

Selection Criteria:
- Must be currently employed at the Municipal Agriculture Office
- Must have basic computer literacy
- Must be involved in agricultural data management

## 3.4 Research Instruments

### 3.4.1 Data Gathering Instruments

1. **Interview Guide**
   - Semi-structured interviews with agricultural officers
   - Focus group discussions with data encoders
   - Farmer consultation sessions

2. **Document Analysis**
   - Existing farmer registration forms (RSBSA)
   - Assistance program records
   - Crop production reports
   - Livestock inventory sheets

3. **System Evaluation Questionnaire**
   - ISO 25010 Software Quality Model criteria
   - User Acceptance Testing (UAT) form
   - System Usability Scale (SUS)

### 3.4.2 Development Tools and Technologies

**Backend Technologies:**
- **Framework**: Laravel 11 (PHP 8.2)
- **Database**: MySQL 8.0
- **Authentication**: Laravel Sanctum
- **Authorization**: Spatie Laravel Permission

**Frontend Technologies:**
- **Framework**: React 18
- **Routing**: Inertia.js
- **Styling**: Tailwind CSS
- **UI Components**: Lucide React Icons
- **Data Tables**: TanStack Table (React Table)
- **Forms**: React Hook Form
- **Notifications**: React Hot Toast

**GIS and Mapping:**
- **Mapping Library**: Leaflet.js
- **React Integration**: React-Leaflet
- **Spatial Data**: GeoJSON format
- **Database Spatial**: MySQL GEOMETRY type

**Development Environment:**
- **Code Editor**: Visual Studio Code
- **Version Control**: Git
- **Local Server**: XAMPP (Apache, MySQL)
- **Package Manager**: Composer (PHP), NPM (JavaScript)

**Testing Tools:**
- **Browser Testing**: Chrome DevTools
- **API Testing**: Postman
- **Performance**: Lighthouse

## 3.5 System Development Methodology

The development of the GeoFarm Information System followed the **Agile Scrum Framework** with two-week sprints. The methodology consisted of the following phases:

### 3.5.1 Phase 1: Requirements Analysis and Planning

**Activities:**
1. Conducted stakeholder interviews with agricultural officers
2. Analyzed existing manual processes and paper-based records
3. Identified system requirements and functional specifications
4. Created user stories and acceptance criteria
5. Prioritized features using MoSCoW method (Must have, Should have, Could have, Won't have)

**Outputs:**
- System Requirements Specification (SRS) document
- User stories and use cases
- Project timeline and sprint planning
- Database schema design

**Duration:** 2 weeks

### 3.5.2 Phase 2: System Design

**Activities:**
1. Designed database schema with 26 tables
2. Created Entity-Relationship Diagram (ERD)
3. Designed user interface mockups and wireframes
4. Planned system architecture (MVC pattern)
5. Designed role-based access control structure
6. Created data flow diagrams

**Outputs:**
- Database schema documentation
- ERD and data dictionary
- UI/UX mockups
- System architecture diagram
- Security and permission matrix

**Duration:** 2 weeks

### 3.5.3 Phase 3: Implementation and Development

**Sprint-based Development:**

**Sprint 1-2: Core Infrastructure**
- User authentication and authorization
- Role-based access control (Super Admin, Admin, Data Encoder, Viewer)
- Dashboard and navigation structure
- Database setup and migrations

**Sprint 3-4: Farmer Management Module**
- Farmer registration and profile management
- RSBSA number tracking
- Photo and QR code generation
- Search and filtering functionality

**Sprint 5-6: Farm Parcel Management**
- Parcel registration with land details
- Ownership type tracking
- Farm type classification
- Parcel-farmer relationship management

**Sprint 7-8: GIS Mapping Integration**
- Leaflet.js integration
- GeoJSON data handling
- Interactive map with parcel boundaries
- Spatial data storage (GEOMETRY type)
- Drawing and editing tools

**Sprint 9-10: Crop Production Tracking**
- Seasonal crop tracking (wet/dry season)
- Planting and harvest date recording
- Yield data collection
- Input usage tracking (fertilizer, seeds)

**Sprint 11-12: Livestock Inventory**
- Multiple livestock categories (large ruminants, small ruminants, swine, poultry)
- Tree crops and fishpond management
- Health status tracking
- Large raiser identification

**Sprint 13-14: Assistance Program Management**
- Financial assistance program creation
- Individual and barangay-level distribution
- Distribution status tracking (pending, claimed, forfeited)
- Beneficiary management

**Sprint 15-16: Reporting and Analytics**
- Farmer demographics report
- Crop production summary
- Livestock inventory report
- Assistance distribution report
- Agricultural assets report
- Export to PDF/Excel functionality

**Sprint 17-18: Predictive Analytics**
- Crop Yield Estimator module
- Historical data analysis
- Yield prediction algorithm
- Input requirement calculation

**Sprint 19-20: System Administration**
- User management with role hierarchy
- Audit log tracking
- Lookup table management
- System settings

**Duration:** 20 sprints × 2 weeks = 40 weeks

### 3.5.4 Phase 4: Testing and Quality Assurance

**Testing Levels:**

1. **Unit Testing**
   - Individual component testing
   - Function-level validation
   - Database query testing

2. **Integration Testing**
   - Module interaction testing
   - API endpoint testing
   - Database transaction testing

3. **System Testing**
   - End-to-end workflow testing
   - Role-based access testing
   - Data validation testing
   - Performance testing

4. **User Acceptance Testing (UAT)**
   - Conducted with actual end-users
   - Real-world scenario testing
   - Usability evaluation
   - Feedback collection

**Testing Criteria:**
- Functionality: All features work as specified
- Usability: System is easy to use and navigate
- Performance: Pages load within 3 seconds
- Security: Unauthorized access is prevented
- Data Integrity: Data is accurately stored and retrieved

**Duration:** 4 weeks

### 3.5.5 Phase 5: Deployment and Training

**Activities:**
1. Server setup and configuration
2. Database migration and data import
3. System deployment to production
4. User training sessions
5. Documentation preparation (user manual, technical documentation)
6. Post-deployment support

**Training Components:**
- System overview and navigation
- Module-specific training (farmers, parcels, assistance, etc.)
- Role-specific training
- Hands-on practice sessions
- Q&A and troubleshooting

**Duration:** 2 weeks

### 3.5.6 Phase 6: Evaluation and Maintenance

**Activities:**
1. System performance monitoring
2. User feedback collection
3. Bug fixing and issue resolution
4. Feature enhancement based on feedback
5. Regular system updates and maintenance

**Evaluation Metrics:**
- System uptime and reliability
- User satisfaction scores
- Data accuracy rate
- Task completion time reduction
- Report generation efficiency

**Duration:** Ongoing

## 3.6 Data Collection Procedures

### 3.6.1 Primary Data Collection

1. **Interviews**
   - Conducted face-to-face interviews with agricultural officers
   - Recorded system requirements and pain points
   - Documented current manual processes

2. **Observation**
   - Observed daily operations at the agriculture office
   - Documented workflow and data handling procedures
   - Identified bottlenecks and inefficiencies

3. **User Acceptance Testing**
   - Distributed UAT questionnaires to respondents
   - Conducted hands-on testing sessions
   - Collected feedback and suggestions

### 3.6.2 Secondary Data Collection

1. **Document Review**
   - Analyzed existing farmer records
   - Reviewed assistance program reports
   - Studied crop production data
   - Examined livestock inventory sheets

2. **Literature Review**
   - Reviewed related studies on agricultural information systems
   - Studied GIS applications in agriculture
   - Researched best practices in web development

## 3.7 Data Analysis

### 3.7.1 Qualitative Data Analysis

- **Thematic Analysis**: Identified common themes from interviews and feedback
- **Content Analysis**: Analyzed document requirements and specifications
- **Narrative Analysis**: Interpreted user stories and use cases

### 3.7.2 Quantitative Data Analysis

Statistical tools used:
- **Descriptive Statistics**: Mean, frequency, percentage for UAT scores
- **System Usability Scale (SUS)**: Calculated usability score (0-100 scale)
- **Performance Metrics**: Response time, load time, query execution time

**Evaluation Criteria:**

| Criterion | Measurement | Acceptable Range |
|-----------|-------------|------------------|
| Functionality | Feature completion rate | ≥ 95% |
| Usability | SUS Score | ≥ 70 |
| Performance | Page load time | ≤ 3 seconds |
| Reliability | System uptime | ≥ 99% |
| Security | Vulnerability count | 0 critical |
| Data Accuracy | Error rate | ≤ 1% |

## 3.8 Ethical Considerations

1. **Informed Consent**: All respondents were informed about the study and gave voluntary consent
2. **Confidentiality**: Personal data was protected and used only for research purposes
3. **Data Privacy**: Complied with Data Privacy Act of 2012 (RA 10173)
4. **Anonymity**: User identities were protected in research documentation
5. **Right to Withdraw**: Respondents could withdraw from the study at any time

## 3.9 System Features and Functionalities

### 3.9.1 Core Modules

1. **User Management**
   - Role-based access control (4 roles)
   - User registration and authentication
   - Permission management
   - Audit trail logging

2. **Farmer Management**
   - Comprehensive farmer profiles
   - RSBSA number tracking
   - Photo and QR code generation
   - Search and filtering

3. **Farm Parcel Management**
   - Land registration and mapping
   - Ownership tracking
   - GIS integration with interactive maps
   - Spatial data storage

4. **Crop Production Tracking**
   - Seasonal tracking (wet/dry)
   - Planting and harvest dates
   - Yield recording
   - Input usage tracking

5. **Livestock Inventory**
   - Multiple livestock categories
   - Health status monitoring
   - Large raiser identification
   - Tree crops and fishponds

6. **Assistance Program Management**
   - Program creation and management
   - Individual and barangay distribution
   - Status tracking
   - Beneficiary management

7. **Reporting and Analytics**
   - Multiple report types
   - Export to PDF/Excel
   - Data visualization
   - Custom date ranges

8. **Crop Yield Estimator**
   - Historical data analysis
   - Yield prediction
   - Input requirement calculation
   - Planning tool for farmers

9. **GIS Mapping**
   - Interactive map interface
   - Parcel boundary visualization
   - Drawing and editing tools
   - Spatial query capabilities

10. **System Administration**
    - Lookup table management
    - Audit log viewing
    - System configuration
    - User activity monitoring

### 3.9.2 Technical Features

1. **Security**
   - CSRF protection
   - SQL injection prevention
   - XSS protection
   - Password encryption (bcrypt)
   - Session management

2. **Performance**
   - Database indexing
   - Query optimization
   - Lazy loading
   - Caching mechanisms

3. **Usability**
   - Responsive design (mobile-friendly)
   - Intuitive navigation
   - Search and filter functionality
   - Toast notifications
   - Form validation

4. **Data Management**
   - Data validation
   - Referential integrity
   - Soft deletes
   - Timestamps tracking
   - Audit trail

## 3.10 System Architecture

### 3.10.1 Architecture Pattern

The system follows the **Model-View-Controller (MVC)** architectural pattern:

- **Model**: Represents data structure and business logic (Laravel Eloquent ORM)
- **View**: User interface components (React components)
- **Controller**: Handles requests and coordinates between Model and View

### 3.10.2 Database Design

- **Database Management System**: MySQL 8.0
- **Total Tables**: 26 tables
- **Relationships**: One-to-Many, Many-to-Many
- **Spatial Data**: GEOMETRY and GeoJSON support
- **Indexing**: Strategic indexes for performance optimization

### 3.10.3 System Flow

1. User accesses the system through web browser
2. Authentication middleware validates user credentials
3. Authorization middleware checks user permissions
4. Controller processes the request
5. Model interacts with database
6. Data is returned to Controller
7. Inertia.js passes data to React components
8. View renders the user interface
9. User interacts with the interface
10. Process repeats for subsequent actions

## 3.11 Limitations of the Study

1. **Scope**: Limited to one municipality; may not be applicable to other regions without customization
2. **Internet Dependency**: Requires stable internet connection for optimal performance
3. **User Training**: Effectiveness depends on user computer literacy and training
4. **Data Migration**: Historical data accuracy depends on quality of existing records
5. **Livestock Prediction**: Current version focuses on crop yield estimation; livestock production forecasting not yet implemented
6. **Mobile App**: Web-based only; native mobile application not included in current scope

---

**Note**: Specific numbers (n=XX, XXX) should be filled in based on your actual data. Adjust the timeline and sprint details according to your actual development process.
