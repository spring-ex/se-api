var database = require('./connection_string.js');
var connection = database.connectionString;

var entities = [{
    name: "Role",
    attributes: [
        "Id INT NOT NULL",
        "Name VARCHAR(50) NOT NULL",
        "RoleCode VARCHAR(50) NOT NULL PRIMARY KEY",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
    ]
}, {
    name: "Package",
    attributes: [
        "Id INT NOT NULL",
        "Name VARCHAR(50) NOT NULL",
        "PackageCode VARCHAR(50) NOT NULL PRIMARY KEY",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
    ]
}, {
    name: "State",
    attributes: [
        "Id INT NOT NULL AUTO_INCREMENT PRIMARY KEY",
        "Name VARCHAR(50) NOT NULL",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
    ]
}, {
    name: "University",
    attributes: [
        "Id INT NOT NULL AUTO_INCREMENT PRIMARY KEY",
        "Name VARCHAR(50) NOT NULL",
        "StateId INT NOT NULL",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        "FOREIGN KEY (StateId) REFERENCES State(Id) ON DELETE CASCADE"
    ]
}, {
    name: "College",
    attributes: [
        "Id INT NOT NULL AUTO_INCREMENT PRIMARY KEY",
        "Name VARCHAR(50) NOT NULL",
        "Nickname VARCHAR(20)",
        "UniversityId INT NOT NULL",
        "StateId INT NOT NULL",
        "LogoImageURL VARCHAR(100)",
        "ShareImageURL VARCHAR(100)",
        "Address VARCHAR(500)",
        "PhoneNumber VARCHAR(15)",
        "PackageCode VARCHAR(15) NOT NULL",
        "BankAccountInfo VARCHAR(200)",
        "SMSBroadcastAvailable VARCHAR(5) DEFAULT false",
        "Type VARCHAR(50) NOT NULL",
        "IsB2C VARCHAR(5) NOT NULL DEFAULT false",
        "TrialPeriodDays INT DEFAULT 30",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        "FOREIGN KEY (UniversityId) REFERENCES University(Id) ON DELETE CASCADE",
        "FOREIGN KEY (PackageCode) REFERENCES Package(PackageCode) ON DELETE CASCADE",
        "FOREIGN KEY (StateId) REFERENCES State(Id) ON DELETE CASCADE"
    ]
}, {
    name: "Route",
    attributes: [
        "Id INT NOT NULL AUTO_INCREMENT PRIMARY KEY",
        "RouteNumber VARCHAR(10) NOT NULL",
        "VehicleRegNumber VARCHAR(15)",
        "AreasCovered VARCHAR(300)",
        "CollegeId INT",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        "FOREIGN KEY (CollegeId) REFERENCES College(Id) ON DELETE CASCADE"
    ]
}, {
    name: "User",
    attributes: [
        "Id INT NOT NULL AUTO_INCREMENT PRIMARY KEY",
        "Name VARCHAR(50) NOT NULL",
        "GenderId VARCHAR(2) NOT NULL DEFAULT 1",
        "DateOfBirth DATE",
        "Email VARCHAR(50)",
        "PhoneNumber VARCHAR(50) NOT NULL",
        "Address VARCHAR(300)",
        "City VARCHAR(50) NOT NULL",
        "State VARCHAR(50) NOT NULL",
        "Designation VARCHAR(50) NOT NULL",
        "ProfileImageURL VARCHAR(100)",
        "Role VARCHAR(15) NOT NULL",
        "Username VARCHAR(50)",
        "Password VARCHAR(50) NOT NULL",
        "CollegeId INT NOT NULL",
        "DeviceId VARCHAR(200)",
        "IsActive VARCHAR(5) DEFAULT 'true'",
        "RouteId INT",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        "FOREIGN KEY (Role) REFERENCES Role(RoleCode)",
        "FOREIGN KEY (CollegeId) REFERENCES College(Id) ON DELETE CASCADE",
        "FOREIGN KEY (RouteId) REFERENCES Route(Id)"
    ]
}, {
    name: "UserEducation",
    attributes: [
        "Id INT NOT NULL AUTO_INCREMENT PRIMARY KEY",
        "University VARCHAR(100) NOT NULL",
        "Degree VARCHAR(100) NOT NULL",
        "YearOfPassing VARCHAR(100) NOT NULL",
        "UserId INT NOT NULL",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        "FOREIGN KEY (UserId) REFERENCES User(Id) ON DELETE CASCADE"
    ]
}, {
    name: "UserExperience",
    attributes: [
        "Id INT NOT NULL AUTO_INCREMENT PRIMARY KEY",
        "CollegeName VARCHAR(100) NOT NULL",
        "Designation VARCHAR(100) NOT NULL",
        "FromDate DATE",
        "ToDate DATE",
        "UserId INT NOT NULL",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        "FOREIGN KEY (UserId) REFERENCES User(Id) ON DELETE CASCADE"
    ]
}, {
    name: "Course",
    attributes: [
        "Id INT NOT NULL AUTO_INCREMENT PRIMARY KEY",
        "Name VARCHAR(50) NOT NULL",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
    ]
}, {
    name: "CollegeHasCourse",
    attributes: [
        "Id INT NOT NULL AUTO_INCREMENT PRIMARY KEY",
        "CollegeId INT NOT NULL",
        "CourseId INT NOT NULL",
        "UniversityId INT NOT NULL",
        "StateId INT NOT NULL",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        "FOREIGN KEY (CollegeId) REFERENCES College(Id) ON DELETE CASCADE",
        "FOREIGN KEY (CourseId) REFERENCES Course(Id) ON DELETE CASCADE",
        "FOREIGN KEY (UniversityId) REFERENCES University(Id) ON DELETE CASCADE",
        "FOREIGN KEY (StateId) REFERENCES State(Id) ON DELETE CASCADE"
    ]
}, {
    name: "Branch",
    attributes: [
        "Id INT NOT NULL AUTO_INCREMENT PRIMARY KEY",
        "Name VARCHAR(50) NOT NULL",
        "CourseId INT NOT NULL",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        "FOREIGN KEY (CourseId) REFERENCES Course(Id) ON DELETE CASCADE"
    ]
}, {
    name: "CollegeHasBranch",
    attributes: [
        "Id INT NOT NULL AUTO_INCREMENT PRIMARY KEY",
        "BranchId INT NOT NULL",
        "CollegeId INT NOT NULL",
        "CourseId INT NOT NULL",
        "UniversityId INT NOT NULL",
        "StateId INT NOT NULL",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        "FOREIGN KEY (BranchId) REFERENCES Branch(Id) ON DELETE CASCADE",
        "FOREIGN KEY (CollegeId) REFERENCES College(Id) ON DELETE CASCADE",
        "FOREIGN KEY (CourseId) REFERENCES Course(Id) ON DELETE CASCADE",
        "FOREIGN KEY (UniversityId) REFERENCES University(Id) ON DELETE CASCADE",
        "FOREIGN KEY (StateId) REFERENCES State(Id) ON DELETE CASCADE"
    ]
}, {
    name: "Semester",
    attributes: [
        "Id INT NOT NULL AUTO_INCREMENT PRIMARY KEY",
        "SemesterNumber VARCHAR(50) NOT NULL",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
    ]
}, {
    name: "BranchHasSemester",
    attributes: [
        "Id INT NOT NULL AUTO_INCREMENT PRIMARY KEY",
        "BranchId INT NOT NULL",
        "SemesterId INT NOT NULL",
        "CourseId INT NOT NULL",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        "FOREIGN KEY (BranchId) REFERENCES Branch(Id) ON DELETE CASCADE",
        "FOREIGN KEY (SemesterId) REFERENCES Semester(Id) ON DELETE CASCADE",
        "FOREIGN KEY (CourseId) REFERENCES Course(Id) ON DELETE CASCADE"
    ]
}, {
    name: "Class",
    attributes: [
        "Id INT NOT NULL AUTO_INCREMENT PRIMARY KEY",
        "Name VARCHAR(50) NOT NULL",
        "BranchId INT NOT NULL",
        "SemesterId INT NOT NULL",
        "CollegeId INT NOT NULL",
        "CourseId INT NOT NULL",
        "UniversityId INT NOT NULL",
        "StateId INT NOT NULL",
        "MeetingURL VARCHAR(100)",
        "MeetingCredentials VARCHAR(100)",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        "FOREIGN KEY (SemesterId) REFERENCES Semester(Id) ON DELETE CASCADE"
    ]
}, {
    name: "SpecialSubject",
    attributes: [
        "Id INT NOT NULL PRIMARY KEY AUTO_INCREMENT",
        "Name VARCHAR(50) NOT NULL",
        "CollegeId INT NOT NULL",
        "CourseId INT NOT NULL",
        "SemesterId INT NOT NULL",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        "FOREIGN KEY (CollegeId) REFERENCES College(Id) ON DELETE CASCADE",
        "FOREIGN KEY (CourseId) REFERENCES Course(Id) ON DELETE CASCADE",
        "FOREIGN KEY (SemesterId) REFERENCES Semester(Id) ON DELETE CASCADE"
    ]
}, {
    name: "Subject",
    attributes: [
        "Id INT NOT NULL AUTO_INCREMENT PRIMARY KEY",
        "Name VARCHAR(50) NOT NULL",
        "Nickname VARCHAR(60)",
        "CourseId INT NOT NULL",
        "BranchId INT NOT NULL",
        "SemesterId INT NOT NULL",
        "IsElective VARCHAR(5)",
        "SpecialSubjectId INT",
        "ImageURL VARCHAR(200)",
        "VisibleOnDashboard VARCHAR(5)",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        "FOREIGN KEY (CourseId) REFERENCES Course(Id) ON DELETE CASCADE",
        "FOREIGN KEY (SemesterId) REFERENCES Semester(Id) ON DELETE CASCADE",
        "FOREIGN KEY (BranchId) REFERENCES Branch(Id) ON DELETE CASCADE",
        "FOREIGN KEY (SpecialSubjectId) REFERENCES SpecialSubject(Id) ON DELETE CASCADE"
    ]
}, {
    name: "UserSubject",
    attributes: [
        "Id INT NOT NULL AUTO_INCREMENT PRIMARY KEY",
        "UserId INT NOT NULL",
        "CourseId INT NOT NULL",
        "BranchId INT NOT NULL",
        "SemesterId INT NOT NULL",
        "ClassId INT NOT NULL",
        "SubjectId INT NOT NULL",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        "FOREIGN KEY (UserId) REFERENCES User(Id) ON DELETE CASCADE",
        "FOREIGN KEY (CourseId) REFERENCES Course(Id) ON DELETE CASCADE",
        "FOREIGN KEY (BranchId) REFERENCES Branch(Id) ON DELETE CASCADE",
        "FOREIGN KEY (SemesterId) REFERENCES Semester(Id) ON DELETE CASCADE",
        "FOREIGN KEY (ClassId) REFERENCES Class(Id) ON DELETE CASCADE",
        "FOREIGN KEY (SubjectId) REFERENCES Subject(Id) ON DELETE CASCADE"
    ]
}, {
    name: "ClassHasSubject",
    attributes: [
        "Id INT NOT NULL AUTO_INCREMENT PRIMARY KEY",
        "ClassId INT NOT NULL",
        "SubjectId INT NOT NULL",
        "SemesterId INT NOT NULL",
        "BranchId INT NOT NULL",
        "CourseId INT NOT NULL",
        "CollegeId INT NOT NULL",
        "UniversityId INT NOT NULL",
        "StateId INT NOT NULL",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        "FOREIGN KEY (ClassId) REFERENCES Class(Id) ON DELETE CASCADE",
        "FOREIGN KEY (SubjectId) REFERENCES Subject(Id) ON DELETE CASCADE",
        "FOREIGN KEY (SemesterId) REFERENCES Semester(Id) ON DELETE CASCADE",
        "FOREIGN KEY (BranchId) REFERENCES Branch(Id) ON DELETE CASCADE",
        "FOREIGN KEY (CourseId) REFERENCES Course(Id) ON DELETE CASCADE",
        "FOREIGN KEY (CollegeId) REFERENCES College(Id) ON DELETE CASCADE",
        "FOREIGN KEY (UniversityId) REFERENCES University(Id) ON DELETE CASCADE",
        "FOREIGN KEY (StateId) REFERENCES State(Id) ON DELETE CASCADE"
    ]
}, {
    name: "Gender",
    attributes: [
        "Id INT NOT NULL AUTO_INCREMENT PRIMARY KEY",
        "Name VARCHAR(10) NOT NULL",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
    ]
}, {
    name: "Admission",
    attributes: [
        "Id INT NOT NULL AUTO_INCREMENT PRIMARY KEY",
        "CollegeId INT NOT NULL",
        "Name VARCHAR(100) NOT NULL",
        "ProfileImageURL VARCHAR(100)",
        "GenderId INT NOT NULL",
        "DateOfBirth DATETIME NOT NULL",
        "AadhaarNumber VARCHAR(15)",
        "FatherName VARCHAR(100)",
        "MotherName VARCHAR(100)",
        "PhoneNumber VARCHAR(15)",
        "Address VARCHAR(500)",
        "Email VARCHAR(100)",
        "FatherOccupation VARCHAR(50)",
        "MotherOccupation VARCHAR(50)",
        "FatherPhoneNumber VARCHAR(15)",
        "MotherPhoneNumber VARCHAR(15)",
        "FatherImageURL VARCHAR(100)",
        "MotherImageURL VARCHAR(100)",
        "FatherDeviceId VARCHAR(200)",
        "MotherDeviceId VARCHAR(200)",
        "TotalFees VARCHAR(8)",
        "Remarks VARCHAR(200)",
        "BloodGroup VARCHAR(10)",
        "MotherTongue VARCHAR(20)",
        "SocialCategory VARCHAR(20)",
        "Nationality VARCHAR(20)",
        "Religion VARCHAR(20)",
        "Caste VARCHAR(20)",
        "SubCaste VARCHAR(20)",
        "CasteCertificateNumber VARCHAR(20)",
        "PreviousSchoolName VARCHAR(50)",
        "PreviousClass VARCHAR(10)",
        "PreviousMediumOfInstruction VARCHAR(20)",
        "TransferCertificateNumber VARCHAR(20)",
        "SATSNumber VARCHAR(20)",
        "ApplicationFormNumber VARCHAR(20)",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        "FOREIGN KEY (CollegeId) REFERENCES College(Id) ON DELETE CASCADE",
        "FOREIGN KEY (GenderId) REFERENCES Gender(Id) ON DELETE CASCADE",
    ]
}, {
    name: "Payment",
    attributes: [
        "Id INT NOT NULL AUTO_INCREMENT PRIMARY KEY",
        "AdmissionId INT NOT NULL",
        "PaymentMode VARCHAR(25) NOT NULL",
        "FeesPaid INT NOT NULL",
        "PaymentModeNumber VARCHAR(50)",
        "PaymentDate DATETIME NOT NULL",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        "FOREIGN KEY (AdmissionId) REFERENCES Admission(Id) ON DELETE CASCADE"
    ]
}, {
    name: "RouteAssignment",
    attributes: [
        "Id INT NOT NULL AUTO_INCREMENT PRIMARY KEY",
        "RouteId INT",
        "UserId INT",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        "FOREIGN KEY (RouteId) REFERENCES Route(Id) ON DELETE CASCADE",
        "FOREIGN KEY (UserId) REFERENCES User(Id) ON DELETE CASCADE"
    ]
}, {
    name: "Student",
    attributes: [
        "Id INT NOT NULL AUTO_INCREMENT PRIMARY KEY",
        "Name VARCHAR(100) NOT NULL",
        "PhoneNumber VARCHAR(50)",
        "IdCardImageURL VARCHAR(100)",
        "IdCardImagePublicId VARCHAR(50)",
        "FindInboxId VARCHAR(50) NOT NULL",
        "RollNumber VARCHAR(20)",
        "Password VARCHAR(50)",
        "CollegeId INT NOT NULL",
        "CourseId INT NOT NULL",
        "BranchId INT NOT NULL",
        "SemesterId INT NOT NULL",
        "ClassId INT NOT NULL",
        "Status INT NOT NULL DEFAULT 1",
        "AdmissionId INT NOT NULL",
        "DeviceId VARCHAR(200)",
        "RouteId INT",
        "StudentType INT",
        "IsRTE INT",
        "TrialStartDate DATE",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        "FOREIGN KEY (CollegeId) REFERENCES College(Id) ON DELETE CASCADE",
        "FOREIGN KEY (CourseId) REFERENCES Course(Id) ON DELETE CASCADE",
        "FOREIGN KEY (BranchId) REFERENCES Branch(Id) ON DELETE CASCADE",
        "FOREIGN KEY (SemesterId) REFERENCES Semester(Id) ON DELETE CASCADE",
        "FOREIGN KEY (ClassId) REFERENCES Class(Id) ON DELETE CASCADE",
        "FOREIGN KEY (AdmissionId) REFERENCES Admission(Id) ON DELETE CASCADE",
        "FOREIGN KEY (RouteId) REFERENCES Route(Id) ON DELETE CASCADE",
    ]
}, {
    name: "Chapter",
    attributes: [
        "Id INT NOT NULL AUTO_INCREMENT PRIMARY KEY",
        "Name VARCHAR(100) NOT NULL",
        "SubjectId INT NOT NULL",
        "DisplayOrder INT",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        "FOREIGN KEY (SubjectId) REFERENCES Subject(Id) ON DELETE CASCADE"
    ]
}, {
    name: "Topic",
    attributes: [
        "Id INT NOT NULL AUTO_INCREMENT PRIMARY KEY",
        "Name VARCHAR(500) NOT NULL",
        "VideoURL VARCHAR(200)",
        "QuestionsMediaURL VARCHAR(500)",
        "DefaultPresentationURL VARCHAR(500)",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
    ]
}, {
    name: "TopicPresentationURL",
    attributes: [
        "TopicId INT NOT NULL",
        "UserId INT NOT NULL",
        "ClassId INT NOT NULL",
        "MediaURL VARCHAR(100) NOT NULL",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        "FOREIGN KEY (TopicId) REFERENCES Topic(Id) ON DELETE CASCADE",
        "FOREIGN KEY (UserId) REFERENCES User(Id) ON DELETE CASCADE",
        "FOREIGN KEY (ClassId) REFERENCES Class(Id) ON DELETE CASCADE",
        "PRIMARY KEY(TopicId, UserId)"
    ]
}, {
    name: "ChapterHasTopic",
    attributes: [
        "Id INT NOT NULL AUTO_INCREMENT PRIMARY KEY",
        "ChapterId INT NOT NULL",
        "TopicId INT NOT NULL",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        "FOREIGN KEY (ChapterId) REFERENCES Chapter(Id) ON DELETE CASCADE",
        "FOREIGN KEY (TopicId) REFERENCES Topic(Id) ON DELETE CASCADE"
    ]
}, {
    name: "Attendance",
    attributes: [
        "Id INT NOT NULL AUTO_INCREMENT PRIMARY KEY",
        "AttendanceDate DATETIME NOT NULL",
        "IsPresent VARCHAR(10) NOT NULL",
        "TakenBy INT NOT NULL",
        "ClassId INT NOT NULL",
        "StudentId INT NOT NULL",
        "SubjectId INT NOT NULL",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        "FOREIGN KEY (TakenBy) REFERENCES User(Id) ON DELETE CASCADE",
        "FOREIGN KEY (StudentId) REFERENCES Student(Id) ON DELETE CASCADE",
        "FOREIGN KEY (SubjectId) REFERENCES Subject(Id) ON DELETE CASCADE",
        "FOREIGN KEY (ClassId) REFERENCES Class(Id) ON DELETE CASCADE"
    ]
}, {
    name: "TopicsTaught",
    attributes: [
        "Id INT NOT NULL AUTO_INCREMENT PRIMARY KEY",
        "ChapterId INT NOT NULL",
        "TopicId INT NOT NULL",
        "ClassId INT NOT NULL",
        "SubjectId INT NOT NULL",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        "FOREIGN KEY (ClassId) REFERENCES Class(Id) ON DELETE CASCADE",
        "FOREIGN KEY (SubjectId) REFERENCES Subject(Id) ON DELETE CASCADE",
        "FOREIGN KEY (ChapterId) REFERENCES Chapter(Id) ON DELETE CASCADE",
        "FOREIGN KEY (TopicId) REFERENCES Topic(Id) ON DELETE CASCADE"
    ]
}, {
    name: "Assignment",
    attributes: [
        "Id INT NOT NULL AUTO_INCREMENT PRIMARY KEY",
        "Name VARCHAR(50) NOT NULL",
        "Description VARCHAR(200) NOT NULL",
        "VideoURL VARCHAR(100)",
        "DocumentURL VARCHAR(100)",
        "SubjectId INT NOT NULL",
        "ClassId INT NOT NULL",
        "GivenBy INT NOT NULL",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        "FOREIGN KEY (SubjectId) REFERENCES Subject(Id) ON DELETE CASCADE",
        "FOREIGN KEY (ClassId) REFERENCES Class(Id) ON DELETE CASCADE",
        "FOREIGN KEY (GivenBy) REFERENCES User(Id) ON DELETE CASCADE"
    ]
}, {
    name: "AssignmentImage",
    attributes: [
        "Id INT NOT NULL AUTO_INCREMENT PRIMARY KEY",
        "AssignmentId INT NOT NULL",
        "ImageURL VARCHAR(100) NOT NULL",
        "PublicId VARCHAR(50) NOT NULL",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        "FOREIGN KEY (AssignmentId) REFERENCES Assignment(Id) ON DELETE CASCADE"
    ]
}, {
    name: "StudentWritesAssignment",
    attributes: [
        "Id INT NOT NULL AUTO_INCREMENT PRIMARY KEY",
        "StudentId INT NOT NULL",
        "AssignmentId INT NOT NULL",
        "DateSubmitted DATETIME NOT NULL",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        "FOREIGN KEY (AssignmentId) REFERENCES Assignment(Id) ON DELETE CASCADE",
        "FOREIGN KEY (StudentId) REFERENCES Student(Id) ON DELETE CASCADE"
    ]
}, {
    name: "AssignmentSubmittedImage",
    attributes: [
        "Id INT NOT NULL AUTO_INCREMENT PRIMARY KEY",
        "SubmittedAssignmentId INT NOT NULL",
        "ImageURL VARCHAR(100) NOT NULL",
        "PublicId VARCHAR(50) NOT NULL",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        "FOREIGN KEY (SubmittedAssignmentId) REFERENCES StudentWritesAssignment(Id) ON DELETE CASCADE"
    ]
}, {
    name: "TestCategory",
    attributes: [
        "Id INT NOT NULL AUTO_INCREMENT PRIMARY KEY",
        "Name VARCHAR(100) NOT NULL",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
    ]
}, {
    name: "Test",
    attributes: [
        "Id INT NOT NULL AUTO_INCREMENT PRIMARY KEY",
        "Name VARCHAR(50) NOT NULL",
        "TestDate DATETIME",
        "MaxMarks VARCHAR(50) NOT NULL",
        "IsFinal VARCHAR(5)",
        "SubjectId INT NOT NULL",
        "ClassId INT NOT NULL",
        "GivenBy INT NOT NULL",
        "TestCategoryId INT",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        "FOREIGN KEY (SubjectId) REFERENCES Subject(Id) ON DELETE CASCADE",
        "FOREIGN KEY (ClassId) REFERENCES Class(Id) ON DELETE CASCADE",
        "FOREIGN KEY (GivenBy) REFERENCES User(Id) ON DELETE CASCADE",
        "FOREIGN KEY (TestCategoryId) REFERENCES TestCategory(Id) ON DELETE CASCADE"
    ]
}, {
    name: "StudentWritesTest",
    attributes: [
        "Id INT NOT NULL AUTO_INCREMENT PRIMARY KEY",
        "StudentId INT NOT NULL",
        "TestId INT NOT NULL",
        "MarksObtained VARCHAR(5) NOT NULL",
        "ResultPercentage FLOAT",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        "FOREIGN KEY (TestId) REFERENCES Test(Id) ON DELETE CASCADE",
        "FOREIGN KEY (StudentId) REFERENCES Student(Id) ON DELETE CASCADE"
    ]
}, {
    name: "Event",
    attributes: [
        "Id Int NOT NULL AUTO_INCREMENT PRIMARY KEY",
        "Name VARCHAR(50) NOT NULL",
        "Description VARCHAR(200) NOT NULL",
        "VideoURL VARCHAR(100)",
        "EventDate DATETIME NOT NULL",
        "CreatedBy INT NOT NULL",
        "CollegeId INT NOT NULL",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        "FOREIGN KEY (CreatedBy) REFERENCES User(Id) ON DELETE CASCADE",
        "FOREIGN KEY (CollegeId) REFERENCES College(Id) ON DELETE CASCADE"
    ]
}, {
    name: "EventImage",
    attributes: [
        "Id INT NOT NULL AUTO_INCREMENT PRIMARY KEY",
        "EventId INT NOT NULL",
        "ImageURL VARCHAR(100) NOT NULL",
        "PublicId VARCHAR(50) NOT NULL",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        "FOREIGN KEY (EventId) REFERENCES Event(Id) ON DELETE CASCADE"
    ]
}, {
    name: "PersonalMessage",
    attributes: [
        "Id INT NOT NULL AUTO_INCREMENT PRIMARY KEY",
        "StudentId INT NOT NULL",
        "UserId INT",
        "Message VARCHAR(500) NOT NULL",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        "FOREIGN KEY (StudentId) REFERENCES Student(Id) ON DELETE CASCADE",
        "FOREIGN KEY (UserId) REFERENCES User(Id) ON DELETE CASCADE"
    ]
}, {
    name: "Enquiry",
    attributes: [
        "Id INT NOT NULL AUTO_INCREMENT PRIMARY KEY",
        "CollegeId INT NOT NULL",
        "Name VARCHAR(100) NOT NULL",
        "GenderId INT NOT NULL",
        "BranchId INT NOT NULL",
        "CourseId INT NOT NULL",
        "DateOfBirth DATETIME NOT NULL",
        "FatherName VARCHAR(100)",
        "MotherName VARCHAR(100)",
        "PhoneNumber VARCHAR(15) NOT NULL",
        "Address VARCHAR(500)",
        "Email VARCHAR(100)",
        "Source VARCHAR(100)",
        "EnquirySession VARCHAR(50) NOT NULL",
        "FatherOccupation VARCHAR(50)",
        "MotherOccupation VARCHAR(50)",
        "LikelyToJoin VARCHAR(6)",
        "Note VARCHAR(300)",
        "FollowUpDate DATETIME",
        "UniqueId VARCHAR(6)",
        "Status VARCHAR(10)",
        "Searchterm VARCHAR(50)",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        "FOREIGN KEY (CollegeId) REFERENCES College(Id) ON DELETE CASCADE",
        "FOREIGN KEY (GenderId) REFERENCES Gender(Id) ON DELETE CASCADE",
        "FOREIGN KEY (BranchId) REFERENCES Branch(Id) ON DELETE CASCADE",
        "FOREIGN KEY (CourseId) REFERENCES Course(Id) ON DELETE CASCADE"
    ]
}, {
    name: "Expenses",
    attributes: [
        "Id INT NOT NULL AUTO_INCREMENT PRIMARY KEY",
        "CollegeId INT NOT NULL",
        "Amount INT NOT NULL",
        "ExpenseDate DATE",
        "Particulars VARCHAR(100) NOT NULL",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        "FOREIGN KEY (CollegeId) REFERENCES College(Id) ON DELETE CASCADE"
    ]
}, {
    name: "Calendar",
    attributes: [
        "Id INT NOT NULL AUTO_INCREMENT PRIMARY KEY",
        "CollegeId INT NOT NULL",
        "EventStartDate DATE NOT NULL",
        "EventEndDate DATE NOT NULL",
        "EventName VARCHAR(100) NOT NULL",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        "FOREIGN KEY (CollegeId) REFERENCES College(Id) ON DELETE CASCADE"
    ]
}, {
    name: "Notification",
    attributes: [
        "Id INT NOT NULL AUTO_INCREMENT PRIMARY KEY",
        "Title VARCHAR(100) NOT NULL",
        "Description VARCHAR(500) NOT NULL",
        "ImageURL VARCHAR(100)",
        "VideoURL VARCHAR(100)",
        "NotificationCode VARCHAR(10)",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
    ]
}, {
    name: "NotificationLedger",
    attributes: [
        "Id INT NOT NULL AUTO_INCREMENT PRIMARY KEY",
        "NotificationId INT NOT NULL",
        "StudentId INT",
        "UserId INT",
        "ArticleId INT",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        "FOREIGN KEY (NotificationId) REFERENCES Notification(Id) ON DELETE CASCADE",
        "FOREIGN KEY (StudentId) REFERENCES Student(Id) ON DELETE CASCADE",
        "FOREIGN KEY (UserId) REFERENCES User(Id) ON DELETE CASCADE"
    ]
}, {
    name: "SubjectHasCategory",
    attributes: [
        "Id INT NOT NULL AUTO_INCREMENT PRIMARY KEY",
        "SubjectId INT NOT NULL",
        "TestCategoryId INT NOT NULL",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        "FOREIGN KEY (SubjectId) REFERENCES Subject(Id) ON DELETE CASCADE",
        "FOREIGN KEY (TestCategoryId) REFERENCES TestCategory(Id) ON DELETE CASCADE"
    ]
}, {
    name: "Keyword",
    attributes: [
        "Id INT NOT NULL AUTO_INCREMENT PRIMARY KEY",
        "CourseKeyword VARCHAR(30) NOT NULL",
        "BranchKeyword VARCHAR(30) NOT NULL",
        "SemesterKeyword VARCHAR(30) NOT NULL",
        "ClassKeyword VARCHAR(30) NOT NULL",
        "SubjectKeyword VARCHAR(30) NOT NULL",
        "CollegeType VARCHAR(50) NOT NULL",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
    ]
}, {
    name: "Question",
    attributes: [
        "Id INT NOT NULL AUTO_INCREMENT PRIMARY KEY",
        "QuestionText VARCHAR(1000)",
        "QuestionType VARCHAR(30) NOT NULL",
        "QuestionForm VARCHAR(10) NOT NULL",
        "QuestionMediaURL VARCHAR(300)",
        "TimeToSolveInSeconds FLOAT",
        "IncludeInSmartLearning VARCHAR(10)",
        "QuestionPublicId VARCHAR(50)",
        "Solution VARCHAR(1000)",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
    ]
}, {
    name: "Options",
    attributes: [
        "Id INT NOT NULL AUTO_INCREMENT PRIMARY KEY",
        "QuestionId INT NOT NULL",
        "OptionForm VARCHAR(30) NOT NULL",
        "OptionMediaURL VARCHAR(300)",
        "OptionText VARCHAR(1000)",
        "OptionValue FLOAT",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        "FOREIGN KEY (QuestionId) REFERENCES Question(Id) ON DELETE CASCADE"
    ]
}, {
    name: "SubTopic",
    attributes: [
        "Id INT NOT NULL AUTO_INCREMENT PRIMARY KEY",
        "Name VARCHAR(500) NOT NULL",
        "TopicId INT NOT NULL",
        "VideoURL VARCHAR(200)",
        "YTChannleName VARCHAR(100)",
        "UserId INT(11)",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        "FOREIGN KEY (TopicId) REFERENCES Topic(Id) ON DELETE CASCADE"
    ]
}, {
    name: "SmartTest",
    attributes: [
        "Id INT NOT NULL AUTO_INCREMENT PRIMARY KEY",
        "Name VARCHAR(100)",
        "EndDate DATETIME",
        "EnableTimeConstraint VARCHAR(10)",
        "Instructions VARCHAR(500)",
        "ChapterId INT",
        "SubjectId INT",
        "TestType INT", //1: chapter wise, 2: academics, 3: practice, 4: skill based
        "IsActive INT DEFAULT 0",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        "FOREIGN KEY (ChapterId) REFERENCES Chapter(Id) ON DELETE CASCADE",
        "FOREIGN KEY (SubjectId) REFERENCES Subject(Id) ON DELETE CASCADE",
    ]
}, {
    name: "SmartTestHasQuestions",
    attributes: [
        "Id INT NOT NULL AUTO_INCREMENT PRIMARY KEY",
        "SmartTestId INT NOT NULL",
        "QuestionId INT NOT NULL",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        "FOREIGN KEY (SmartTestId) REFERENCES SmartTest(Id) ON DELETE CASCADE",
        "FOREIGN KEY (QuestionId) REFERENCES Question(Id) ON DELETE CASCADE",
    ]
}, {
    name: "TopicHasSmartTest",
    attributes: [
        "Id INT NOT NULL AUTO_INCREMENT PRIMARY KEY",
        "SmartTestId INT NOT NULL",
        "TopicId INT NOT NULL",
        "ChapterId INT NOT NULL",
        "SubjectId INT NOT NULL",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        "FOREIGN KEY (SmartTestId) REFERENCES SmartTest(Id) ON DELETE CASCADE",
        "FOREIGN KEY (TopicId) REFERENCES Topic(Id) ON DELETE CASCADE",
        "FOREIGN KEY (ChapterId) REFERENCES Chapter(Id) ON DELETE CASCADE",
        "FOREIGN KEY (SubjectId) REFERENCES Subject(Id) ON DELETE CASCADE"
    ]
}, {
    name: "StudentWritesSmartTest",
    attributes: [
        "Id INT NOT NULL AUTO_INCREMENT PRIMARY KEY",
        "StudentId INT NOT NULL",
        "QuestionId INT NOT NULL",
        "SelectedOption INT",
        "ResultPercentage FLOAT",
        "TimeTakenInSeconds FLOAT",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        "FOREIGN KEY (StudentId) REFERENCES Student(Id) ON DELETE CASCADE",
        "FOREIGN KEY (QuestionId) REFERENCES Question(Id) ON DELETE CASCADE",
        "FOREIGN KEY (SelectedOption) REFERENCES Options(Id) ON DELETE CASCADE"
    ]
}, {
    name: "StudentCompletesSmartTest",
    attributes: [
        "Id INT NOT NULL AUTO_INCREMENT PRIMARY KEY",
        "StudentId INT NOT NULL",
        "SmartTestId INT NOT NULL",
        "IsCompleted VARCHAR(10)",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        "FOREIGN KEY (StudentId) REFERENCES Student(Id) ON DELETE CASCADE",
        "FOREIGN KEY (SmartTestId) REFERENCES SmartTest(Id) ON DELETE CASCADE"
    ]
}, {
    name: "TopicPerformanceIndex",
    attributes: [
        "StudentId INT NOT NULL",
        "TopicId INT NOT NULL",
        "ChapterId INT NOT NULL",
        "SubjectId INT NOT NULL",
        "TopicScore VARCHAR(10)",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        "FOREIGN KEY (StudentId) REFERENCES Student(Id) ON DELETE CASCADE",
        "FOREIGN KEY (TopicId) REFERENCES Topic(Id) ON DELETE CASCADE",
        "FOREIGN KEY (ChapterId) REFERENCES Chapter(Id) ON DELETE CASCADE",
        "FOREIGN KEY (SubjectId) REFERENCES Subject(Id) ON DELETE CASCADE",
        "PRIMARY KEY(StudentId,TopicId)"
    ]
}, {
    name: "SubjectAcademicPerformanceIndex",
    attributes: [
        "StudentId INT NOT NULL",
        "SubjectId INT NOT NULL",
        "SubjectScore VARCHAR(10)",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        "FOREIGN KEY (StudentId) REFERENCES Student(Id) ON DELETE CASCADE",
        "FOREIGN KEY (SubjectId) REFERENCES Subject(Id) ON DELETE CASCADE",
        "PRIMARY KEY(StudentId,SubjectId)"
    ]
}, {
    name: "StudentTakesElective",
    attributes: [
        "StudentId INT NOT NULL",
        "ClassId INT NOT NULL",
        "SubjectId INT NOT NULL",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        "FOREIGN KEY (StudentId) REFERENCES Student(Id) ON DELETE CASCADE",
        "FOREIGN KEY (ClassId) REFERENCES Class(Id) ON DELETE CASCADE",
        "FOREIGN KEY (SubjectId) REFERENCES Subject(Id) ON DELETE CASCADE",
        "PRIMARY KEY(StudentId,ClassId,SubjectId)"
    ]
}, {
    name: "Book",
    attributes: [
        "Id INT NOT NULL AUTO_INCREMENT PRIMARY KEY",
        "AccessionNumber VARCHAR(25)",
        "IssueOrReference VARCHAR(10)",
        "Author VARCHAR(200)",
        "SecondAuthor VARCHAR(200)",
        "Name VARCHAR(200) NOT NULL",
        "Edition VARCHAR(3)",
        "Publisher VARCHAR(100)",
        "Place VARCHAR(100)",
        "Year INT",
        "ISBN VARCHAR(20)",
        "Suppliers VARCHAR(100)",
        "Price INT",
        "InvoiceNumber VARCHAR(15)",
        "Remarks VARCHAR(100)",
        "Department VARCHAR(20)",
        "PurchasedOrGift VARCHAR(10)",
        "CallNo VARCHAR(20)",
        "CollegeId INT NOT NULL",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        "FOREIGN KEY (CollegeId) REFERENCES College(Id) ON DELETE CASCADE"
    ]
}, {
    name: "StudentBorrowsBook",
    attributes: [
        "StudentId INT NOT NULL",
        "BookId INT NOT NULL",
        "BorrowDate DATETIME NOT NULL",
        "ReturnDate DATETIME NOT NULL",
        "HasReturned VARCHAR(5)",
        "ReturnedDate DATETIME",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        "PRIMARY KEY(StudentId,BookId,BorrowDate)"
    ]
}, {
    name: "UserTakesSpecialSubject",
    attributes: [
        "UserId INT NOT NULL",
        "SpecialSubjectId INT NOT NULL",
        "SpecialClassId INT",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        "PRIMARY KEY(UserId,SpecialSubjectId)",
        "FOREIGN KEY(SpecialSubjectId) REFERENCES SpecialSubject(Id)"
    ]
}, {
    name: "SpecialClass",
    attributes: [
        "Id INT NOT NULL PRIMARY KEY AUTO_INCREMENT",
        "Name VARCHAR(50) NOT NULL",
        "SpecialSubjectId INT NOT NULL",
        "CollegeId INT NOT NULL",
        "CourseId INT NOT NULL",
        "SemesterId INT NOT NULL",
        "MeetingURL VARCHAR(100)",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        "FOREIGN KEY (CollegeId) REFERENCES College(Id) ON DELETE CASCADE",
        "FOREIGN KEY (CourseId) REFERENCES Course(Id) ON DELETE CASCADE",
        "FOREIGN KEY (SemesterId) REFERENCES Semester(Id) ON DELETE CASCADE",
        "FOREIGN KEY (SpecialSubjectId) REFERENCES SpecialSubject(Id) ON DELETE CASCADE"
    ]
}, {
    name: "StudentTakesSpecialClass",
    attributes: [
        "StudentId INT NOT NULL",
        "SpecialClassId INT NOT NULL",
        "NormalSubjectId INT NOT NULL",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        "PRIMARY KEY(StudentId,SpecialClassId)",
        "FOREIGN KEY (NormalSubjectId) REFERENCES Subject(Id) ON DELETE CASCADE"
    ]
}, {
    name: "TopicHasDefaultPresentation",
    attributes: [
        "ChapterId INT NOT NULL",
        "TopicId INT NOT NULL",
        "MediaURL VARCHAR(100)",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        "PRIMARY KEY(ChapterId,TopicId)"
    ]
}, {
    name: "StudentLikesTopic",
    attributes: [
        "StudentId INT NOT NULL",
        "ChapterId INT NOT NULL",
        "TopicId INT NOT NULL",
        "HasLiked VARCHAR(100)",
        "Comments VARCHAR(500)",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        "PRIMARY KEY(StudentId, ChapterId,TopicId)"
    ]
}, {
    name: "StudentReportsQuestion",
    attributes: [
        "StudentId INT NOT NULL",
        "QuestionId INT NOT NULL",
        "Remarks VARCHAR(700)",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        "PRIMARY KEY(StudentId, QuestionId)"
    ]
}, {
    name: "ProgramOutcome",
    attributes: [
        "Id INT NOT NULL AUTO_INCREMENT PRIMARY KEY",
        "Name VARCHAR(100)",
        "Description VARCHAR(1000)",
        "CollegeId INT NOT NULL",
        "CourseId INT NOT NULL",
        "BranchId INT NOT NULL",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        "FOREIGN KEY (CollegeId) REFERENCES College(Id) ON DELETE CASCADE",
        "FOREIGN KEY (CourseId) REFERENCES Course(Id) ON DELETE CASCADE",
        "FOREIGN KEY (BranchId) REFERENCES Branch(Id) ON DELETE CASCADE"
    ]
}, {
    name: "CourseOutcome",
    attributes: [
        "Id INT NOT NULL AUTO_INCREMENT PRIMARY KEY",
        "Name VARCHAR(100)",
        "Description VARCHAR(1000)",
        "CollegeId INT NOT NULL",
        "CourseId INT NOT NULL",
        "BranchId INT NOT NULL",
        "SemesterId INT NOT NULL",
        "ClassId INT NOT NULL",
        "SubjectId INT NOT NULL",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        "FOREIGN KEY (CollegeId) REFERENCES College(Id) ON DELETE CASCADE",
        "FOREIGN KEY (CourseId) REFERENCES Course(Id) ON DELETE CASCADE",
        "FOREIGN KEY (BranchId) REFERENCES Branch(Id) ON DELETE CASCADE",
        "FOREIGN KEY (SemesterId) REFERENCES Semester(Id) ON DELETE CASCADE",
        "FOREIGN KEY (ClassId) REFERENCES Class(Id) ON DELETE CASCADE",
        "FOREIGN KEY (SubjectId) REFERENCES Subject(Id) ON DELETE CASCADE"
    ]
}, {
    name: "ProgramOutcomeHasCourseOutcome",
    attributes: [
        "Id INT NOT NULL AUTO_INCREMENT PRIMARY KEY",
        "POId INT NOT NULL",
        "COId INT NOT NULL",
        "Descriptor INT",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        "FOREIGN KEY (POId) REFERENCES ProgramOutcome(Id) ON DELETE CASCADE",
        "FOREIGN KEY (COId) REFERENCES CourseOutcome(Id) ON DELETE CASCADE"
    ]
}, {
    name: "BloomsTaxonomy",
    attributes: [
        "Id INT NOT NULL AUTO_INCREMENT PRIMARY KEY",
        "Name VARCHAR(30)",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
    ]
}, {
    name: "TopicHasQuestion",
    attributes: [
        "Id INT NOT NULL AUTO_INCREMENT PRIMARY KEY",
        "QuestionId INT NOT NULL",
        "TopicId INT NOT NULL",
        "COId INT",
        "BTId INT",
        "Tags VARCHAR(500)",
        "Notes VARCHAR(500)",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        "FOREIGN KEY (QuestionId) REFERENCES Question(Id) ON DELETE CASCADE",
        "FOREIGN KEY (TopicId) REFERENCES Topic(Id) ON DELETE CASCADE",
        "FOREIGN KEY (COId) REFERENCES Chapter(CourseOutcomeId) ON DELETE CASCADE",
        "FOREIGN KEY (BTId) REFERENCES BloomsTaxonomy(Id) ON DELETE CASCADE"
    ]
}, {
    name: "Criteria",
    attributes: [
        "Id INT NOT NULL AUTO_INCREMENT PRIMARY KEY",
        "Name VARCHAR(1000)",
        "ImageURL VARCHAR(500)",
        "ImagePublicId VARCHAR(50)",
        "BTId INT",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        "FOREIGN KEY (BTId) REFERENCES BloomsTaxonomy(Id) ON DELETE CASCADE"
    ]
}, {
    name: "TopicHasCriteria",
    attributes: [
        "ChapterId INT NOT NULL",
        "TopicId INT NOT NULL",
        "CriteriaId INT NOT NULL",
        "Tags VARCHAR(500)",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        "FOREIGN KEY (ChapterId) REFERENCES Chapter(Id) ON DELETE CASCADE",
        "FOREIGN KEY (TopicId) REFERENCES Topic(Id) ON DELETE CASCADE",
        "FOREIGN KEY (CriteriaId) REFERENCES Criteria(Id) ON DELETE CASCADE"
    ]
}, {
    name: "TestHasCriteria",
    attributes: [
        "TestId INT NOT NULL",
        "CriteriaId INT NOT NULL",
        "COId INT",
        "BTId INT",
        "MaxScore VARCHAR(5)",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        "FOREIGN KEY (BTId) REFERENCES BloomsTaxonomy(Id) ON DELETE CASCADE",
        "FOREIGN KEY (COId) REFERENCES CourseOutcome(Id) ON DELETE CASCADE",
        "FOREIGN KEY (TestId) REFERENCES Test(Id) ON DELETE CASCADE",
        "FOREIGN KEY (CriteriaId) REFERENCES Criteria(Id) ON DELETE CASCADE",
        "PRIMARY KEY(TestId, CriteriaId)"
    ]
}, {
    name: "StudentWritesCriteria",
    attributes: [
        "StudentId INT NOT NULL",
        "TestId INT NOT NULL",
        "CriteriaId INT NOT NULL",
        "MarksScored VARCHAR(5)",
        "ResultPercentage FLOAT",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        "PRIMARY KEY(StudentId, TestId, CriteriaId)",
        "FOREIGN KEY (StudentId) REFERENCES Student(Id) ON DELETE CASCADE",
        "FOREIGN KEY (TestId) REFERENCES Test(Id) ON DELETE CASCADE",
        "FOREIGN KEY (CriteriaId) REFERENCES Criteria(Id) ON DELETE CASCADE"
    ]
}, {
    name: "StudentCOPerformanceIndex",
    attributes: [
        "StudentId INT NOT NULL",
        "COId INT NOT NULL",
        "COFromTest FLOAT",
        "COFromQuiz FLOAT",
        "COFromExam FLOAT",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        "PRIMARY KEY(StudentId, COId)",
        "FOREIGN KEY (StudentId) REFERENCES Student(Id) ON DELETE CASCADE",
        "FOREIGN KEY (COId) REFERENCES CourseOutcome(Id) ON DELETE CASCADE"
    ]
}, {
    name: "StudentBTPerformanceIndex",
    attributes: [
        "StudentId INT NOT NULL",
        "BTId INT NOT NULL",
        "BTFromTest FLOAT",
        "BTFromQuiz FLOAT",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        "PRIMARY KEY(StudentId, BTId)",
        "FOREIGN KEY (StudentId) REFERENCES Student(Id) ON DELETE CASCADE",
        "FOREIGN KEY (BTId) REFERENCES BloomsTaxonomy(Id) ON DELETE CASCADE"
    ]
}, {
    name: "Searchword",
    attributes: [
        "Id INT NOT NULL AUTO_INCREMENT PRIMARY KEY",
        "Name VARCHAR(100)",
        "SubjectId INT",
        "Type INT",
        "FacultySuggestion VARCHAR(100)",
        "StudentSuggestion VARCHAR(100)",
        "ImageURL VARCHAR(100)",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        "FOREIGN KEY (SubjectId) REFERENCES Subject(Id) ON DELETE CASCADE"
    ]
}, {
    name: "AdmissionDocuments",
    attributes: [
        "Id INT NOT NULL AUTO_INCREMENT PRIMARY KEY",
        "Name VARCHAR(100)",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
    ]
}, {
    name: "StudentPreviousMarks",
    attributes: [
        "Id INT NOT NULL AUTO_INCREMENT PRIMARY KEY",
        "StudentId INT NOT NULL",
        "UniversityName VARCHAR(1000)",
        "MaxMarks INT NOT NULL",
        "MarksObtained INT NOT NULL",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        "FOREIGN KEY (StudentId) REFERENCES Student(Id) ON DELETE CASCADE"
    ]
}, {
    name: "CollegeHasAdmissionDocuments",
    attributes: [
        "Id INT NOT NULL AUTO_INCREMENT PRIMARY KEY",
        "CollegeId INT",
        "DocumentId INT",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        "FOREIGN KEY (CollegeId) REFERENCES College(Id) ON DELETE CASCADE",
        "FOREIGN KEY (DocumentId) REFERENCES AdmissionDocuments(Id) ON DELETE CASCADE"
    ]
}, {
    name: "StudentHasAdmissionDocuments",
    attributes: [
        "Id INT NOT NULL AUTO_INCREMENT PRIMARY KEY",
        "StudentId INT",
        "DocumentId INT",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        "FOREIGN KEY (StudentId) REFERENCES Student(Id) ON DELETE CASCADE",
        "FOREIGN KEY (DocumentId) REFERENCES AdmissionDocuments(Id) ON DELETE CASCADE"
    ]
}, {
    name: "FeesStructure",
    attributes: [
        "Id INT NOT NULL AUTO_INCREMENT PRIMARY KEY",
        "CollegeId INT",
        "BranchId INT",
        "AcademicYear VARCHAR(10)",
        "ApplicationFormFees INT DEFAULT 0",
        "TuitionFees INT DEFAULT 0",
        "OtherComponent1 INT DEFAULT 0",
        "OtherComponent2 INT DEFAULT 0",
        "RegularComponent1 INT DEFAULT 0",
        "RegularComponent2 INT DEFAULT 0",
        "RegularComponent3 INT DEFAULT 0",
        "RegularComponent4 INT DEFAULT 0",
        "RegularComponent5 INT DEFAULT 0",
        "RegularComponent6 INT DEFAULT 0",
        "RegularComponent7 INT DEFAULT 0",
        "RegularComponent8 INT DEFAULT 0",
        "RegularComponent9 INT DEFAULT 0",
        "RegularComponent10 INT DEFAULT 0",
        "RegularComponent11 INT DEFAULT 0",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        "FOREIGN KEY (CollegeId) REFERENCES College(Id) ON DELETE CASCADE",
        "FOREIGN KEY (BranchId) REFERENCES Branch(Id) ON DELETE CASCADE"
    ]
}, {
    name: "TransportFees",
    attributes: [
        "Id INT NOT NULL AUTO_INCREMENT PRIMARY KEY",
        "Name VARCHAR(50)",
        "CollegeId INT",
        "StartKM INT",
        "EndKM INT",
        "Fees INT",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        "FOREIGN KEY (CollegeId) REFERENCES College(Id) ON DELETE CASCADE"
    ]
}, {
    name: "FeesCollection",
    attributes: [
        "StudentId INT",
        "AcademicYear VARCHAR(10)",
        "Month VARCHAR(15)",
        "Type1Fees FLOAT DEFAULT 0", //monthly with discount
        "Type1Status INT DEFAULT 0",
        "Type2Fees FLOAT DEFAULT 0", //annually without discount
        "Type1ReceiptNumber VARCHAR(10)",
        "Type1PaymentDate DATE",
        "Type1PaymentMode VARCHAR(25)",
        "Type1Note VARCHAR(50)",
        "Type3Fees FLOAT DEFAULT 0", //monthly with discount
        "Type3Status INT DEFAULT 0",
        "Type3ReceiptNumber VARCHAR(10)",
        "Type3PaymentDate DATE",
        "Type3PaymentMode VARCHAR(25)",
        "Type3Note VARCHAR(50)",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        "FOREIGN KEY (StudentId) REFERENCES Student(Id) ON DELETE CASCADE",
        "PRIMARY KEY(StudentId, AcademicYear, Month)"
    ]
}, {
    name: "Type4FeesCollection",
    attributes: [
        "Id INT NOT NULL AUTO_INCREMENT PRIMARY KEY",
        "StudentId INT",
        "AcademicYear VARCHAR(10)",
        "Type4Fees FLOAT DEFAULT 0", //annually with discount
        "Discount FLOAT DEFAULT 0",
        "AddOnFees FLOAT DEFAULT 0",
        "Type4ReceiptNumber VARCHAR(10)",
        "Type4PaymentDate DATE",
        "Type4PaymentMode VARCHAR(25)",
        "Type4Note VARCHAR(50)",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        "FOREIGN KEY (StudentId) REFERENCES Student(Id) ON DELETE CASCADE",
    ]
}, {
    name: "Receipt",
    attributes: [
        "Id INT NOT NULL AUTO_INCREMENT PRIMARY KEY",
        "StudentId INT",
        "BranchId INT",
        "AcademicYear VARCHAR(10)",
        "InvoiceValue FLOAT DEFAULT 0",
        "Months VARCHAR(100)",
        "Discount FLOAT DEFAULT 0",
        "AddOnFees FLOAT DEFAULT 0",
        "FeesType VARCHAR(10)",
        "PaymentType VARCHAR(25)",
        "PaymentDate DATE",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        "FOREIGN KEY (StudentId) REFERENCES Student(Id) ON DELETE CASCADE",
        "FOREIGN KEY (BranchId) REFERENCES Branch(Id) ON DELETE CASCADE",
    ]
}, {
    name: "CollegeHasFeesKeywords",
    attributes: [
        "Id INT NOT NULL AUTO_INCREMENT PRIMARY KEY",
        "CollegeId INT",
        "ApplicationFormFees VARCHAR(50) DEFAULT 'Application Form Fees'",
        "TuitionFees VARCHAR(50) DEFAULT 'Tuition Fees'",
        "OtherComponent1 VARCHAR(50) DEFAULT 'Annual Development Fees 1'",
        "OtherComponent2 VARCHAR(50) DEFAULT 'Annual Development Fees 2'",
        "RegularComponent1 VARCHAR(50) DEFAULT 'Regular Component1'",
        "RegularComponent2 VARCHAR(50) DEFAULT 'Regular Component2'",
        "RegularComponent3 VARCHAR(50) DEFAULT 'Regular Component3'",
        "RegularComponent4 VARCHAR(50) DEFAULT 'Regular Component4'",
        "RegularComponent5 VARCHAR(50) DEFAULT 'Regular Component5'",
        "RegularComponent6 VARCHAR(50) DEFAULT 'Regular Component6'",
        "RegularComponent7 VARCHAR(50) DEFAULT 'Regular Component7'",
        "RegularComponent8 VARCHAR(50) DEFAULT 'Regular Component8'",
        "RegularComponent9 VARCHAR(50) DEFAULT 'Regular Component9'",
        "RegularComponent10 VARCHAR(50) DEFAULT 'Regular Component10'",
        "RegularComponent11 VARCHAR(50) DEFAULT 'Regular Component11'",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        "FOREIGN KEY (CollegeId) REFERENCES College(Id) ON DELETE CASCADE"
    ]
}, {
    name: "TimeTable",
    attributes: [
        "ClassId INT NOT NULL",
        "SubjectId INT NOT NULL",
        "Day VARCHAR(15) NOT NULL",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        "FOREIGN KEY (ClassId) REFERENCES Class(Id) ON DELETE CASCADE",
        "FOREIGN KEY (SubjectId) REFERENCES Subject(Id) ON DELETE CASCADE",
        "PRIMARY KEY(ClassId, SubjectId, Day)"
    ]
}, {
    name: "ClassHasSmartTest",
    attributes: [
        "ClassId INT NOT NULL",
        "ChapterId INT NOT NULL",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        "FOREIGN KEY (ClassId) REFERENCES Class(Id) ON DELETE CASCADE",
        "FOREIGN KEY (ChapterId) REFERENCES Chapter(Id) ON DELETE CASCADE",
        "PRIMARY KEY(ClassId, ChapterId)"
    ]
}, {
    name: "StudentRatesTopic",
    attributes: [
        "StudentId INT NOT NULL",
        "ChapterId INT NOT NULL",
        "TopicId INT NOT NULL",
        "ClassId INT NOT NULL",
        "Rating INT NOT NULL",
        "CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        "FOREIGN KEY (StudentId) REFERENCES Student(Id) ON DELETE CASCADE",
        "FOREIGN KEY (ChapterId) REFERENCES Chapter(Id) ON DELETE CASCADE",
        "FOREIGN KEY (ClassId) REFERENCES Class(Id) ON DELETE CASCADE",
        "FOREIGN KEY (TopicId) REFERENCES Topic(Id) ON DELETE CASCADE",
        "PRIMARY KEY(StudentId, ChapterId, TopicId, ClassId)"
    ]
}];

function addData() {
    // var data = [
    //     //Roles
    //     'INSERT INTO Role(Id, Name, RoleCode) VALUES (1,"Admin", "ADMIN")',
    //     'INSERT INTO Role(Id, Name, RoleCode) VALUES (2,"Faculty", "FACULTY")',
    //     'INSERT INTO Role(Id, Name, RoleCode) VALUES (3,"Staff", "STAFF")',
    //     'INSERT INTO Role(Id, Name, RoleCode) VALUES (4,"Super Admin", "SUPERADMIN")',
    //     'INSERT INTO Role(Id, Name, RoleCode) VALUES (5,"Driver", "DRIVER")',
    //     'INSERT INTO Role(Id, Name, RoleCode) VALUES (6,"Uploader", "UPLOADER")',
    //     //Packages
    //     'INSERT INTO Package(Id, Name, PackageCode) VALUES (1,"Basic", "BASIC")',
    //     'INSERT INTO Package(Id, Name, PackageCode) VALUES (2,"Extended", "EXTENDED")',
    //     'INSERT INTO Package(Id, Name, PackageCode) VALUES (3,"Little Millennium", "LM")',
    //     'INSERT INTO Package(Id, Name, PackageCode) VALUES (4,"Smart", "SMART")',
    //     //Genders
    //     'INSERT INTO Gender(Id, Name) VALUES (1, "Male")',
    //     'INSERT INTO Gender(Id, Name) VALUES (2, "Female")',
    //     //FindInbox Data
    //     'INSERT INTO State(Id, Name) VALUES (1,"Karnataka")',
    //     'INSERT INTO University(Id, Name, StateId) VALUES (1, "FI University", 1)',
    //     'INSERT INTO College(Id, Name, UniversityId, StateId, PackageCode) VALUES (1, "FI College", 1, 1, "BASIC")',
    //     'INSERT INTO User(Id, Name, DateOfBirth, Email, PhoneNumber, Address, City, State, Designation, ProfileImageURL, Role, Username, Password, CollegeId) VALUES (NULL, "Abhijith Jain N", "1990-07-02", "abhijithjain@findinbox.com", "9591241474", "#", "#", "#", "CEO", "http://placehold.it/50x100", "SUPERADMIN", "abhijithjain@findinbox.com", "sonyMt15i", 1)',
    //     'INSERT INTO User(Id, Name, DateOfBirth, Email, PhoneNumber, Address, City, State, Designation, ProfileImageURL, Role, Username, Password, CollegeId) VALUES (NULL, "Ajith Simha T N", "1990-08-06", "ajithsimha@findinbox.com", "9739241152", "#", "#", "#", "CTO", "http://placehold.it/50x100", "SUPERADMIN", "ajithsimha@findinbox.com", "aJiTh!@#", 1)',
    // ];
    // connection.query(data.join("; "), function(err, results) {
    //     if (err) throw err;
    console.log('==========Data setup is completed==========');
    connection.end();
    // });
};

function createTables() {
    connection.connect();
    var createStatements = [];
    for (var i = 0; i < entities.length; i++) {
        var stmt = "CREATE TABLE IF NOT EXISTS " + entities[i].name + "(" + entities[i].attributes.join(", ") + ")ENGINE=INNODB";
        createStatements.push(stmt);
    }
    connection.query(createStatements.join("; "), function(err, results) {
        if (err) throw err;
        addData();
    });
};

createTables();