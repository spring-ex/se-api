------------StudentWritesSmartTest---------------------------

CREATE DEFINER=`apwrg2ce352zfu2q`@`%` TRIGGER `nm96olu1l36pl3kh`.`StudentWritesSmartTest_AFTER_INSERT` AFTER INSERT ON `StudentWritesSmartTest` FOR EACH ROW
BEGIN
	DECLARE topic_id INT;
    DECLARE chapter_id INT;
    DECLARE subject_id INT;
    DECLARE new_topic_average FLOAT;
    
	SELECT TopicId FROM TopicHasQuestion WHERE QuestionId = NEW.QuestionId INTO topic_id;
    SELECT DISTINCT ChapterId, SubjectId INTO chapter_id, subject_id FROM TopicHasSmartTest WHERE TopicId = topic_id;
	SELECT AVG(ResultPercentage) FROM StudentWritesSmartTest WHERE StudentId = NEW.StudentId AND QuestionId IN(SELECT QuestionId FROM TopicHasQuestion WHERE TopicId = topic_id) INTO new_topic_average;
    
    INSERT INTO TopicPerformanceIndex (StudentId, TopicId, ChapterId, SubjectId, TopicScore) VALUES(NEW.StudentId, topic_id, chapter_id, subject_id, new_topic_average) ON DUPLICATE KEY UPDATE TopicScore = VALUES(TopicScore);
END


CREATE DEFINER=`apwrg2ce352zfu2q`@`%` TRIGGER `nm96olu1l36pl3kh`.`StudentWritesSmartTest_AFTER_UPDATE` AFTER UPDATE ON `StudentWritesSmartTest` FOR EACH ROW
BEGIN
	DECLARE topic_id INT;
    DECLARE chapter_id INT;
    DECLARE subject_id INT;
    DECLARE new_topic_average FLOAT;
    
	SELECT TopicId FROM TopicHasQuestion WHERE QuestionId = NEW.QuestionId INTO topic_id;
    SELECT DISTINCT ChapterId, SubjectId INTO chapter_id, subject_id FROM TopicHasSmartTest WHERE TopicId = topic_id;
	SELECT AVG(ResultPercentage) FROM StudentWritesSmartTest WHERE StudentId = NEW.StudentId AND QuestionId IN(SELECT QuestionId FROM TopicHasQuestion WHERE TopicId = topic_id) INTO new_topic_average;
    
    INSERT INTO TopicPerformanceIndex (StudentId, TopicId, ChapterId, SubjectId, TopicScore) VALUES(NEW.StudentId, topic_id, chapter_id, subject_id, new_topic_average) ON DUPLICATE KEY UPDATE TopicScore = VALUES(TopicScore);
END


CREATE DEFINER=`apwrg2ce352zfu2q`@`%` TRIGGER `nm96olu1l36pl3kh`.`StudentWritesSmartTest_AFTER_DELETE` AFTER DELETE ON `StudentWritesSmartTest` FOR EACH ROW
BEGIN
	DECLARE topic_id INT;
    DECLARE chapter_id INT;
    DECLARE subject_id INT;
    
	SELECT TopicId FROM TopicHasQuestion WHERE QuestionId = OLD.QuestionId INTO topic_id;
    SELECT DISTINCT ChapterId, SubjectId INTO chapter_id, subject_id FROM TopicHasSmartTest WHERE TopicId = topic_id;
    
    INSERT INTO TopicPerformanceIndex (StudentId, TopicId, ChapterId, SubjectId, TopicScore) VALUES(OLD.StudentId, topic_id, chapter_id, subject_id, null) ON DUPLICATE KEY UPDATE TopicScore = VALUES(TopicScore);
END


------------StudentWritesTest---------------------------
CREATE DEFINER=`apwrg2ce352zfu2q`@`%` TRIGGER `nm96olu1l36pl3kh`.`StudentWritesTest_AFTER_INSERT` AFTER INSERT ON `StudentWritesTest` FOR EACH ROW
BEGIN
DECLARE new_subject_average FLOAT;
    DECLARE subject_id INT;
    
    SELECT SubjectId INTO subject_id FROM Test WHERE Id = NEW.TestId;
	
    SELECT AVG(ResultPercentage) INTO new_subject_average FROM StudentWritesTest WHERE StudentId = NEW.StudentId AND TestId IN(SELECT Id FROM Test WHERE SubjectId = subject_id);

	INSERT INTO SubjectAcademicPerformanceIndex (StudentId, SubjectId, SubjectScore) VALUES(NEW.StudentId, subject_id, new_subject_average) ON DUPLICATE KEY UPDATE SubjectScore = VALUES(SubjectScore);
END

CREATE DEFINER=`apwrg2ce352zfu2q`@`%` TRIGGER `nm96olu1l36pl3kh`.`StudentWritesTest_AFTER_UPDATE` AFTER UPDATE ON `StudentWritesTest` FOR EACH ROW
BEGIN
DECLARE new_subject_average FLOAT;
    DECLARE subject_id INT;
    
    SELECT SubjectId INTO subject_id FROM Test WHERE Id = NEW.TestId;
	
    SELECT AVG(ResultPercentage) INTO new_subject_average FROM StudentWritesTest WHERE StudentId = NEW.StudentId AND TestId IN(SELECT Id FROM Test WHERE SubjectId = subject_id);

	INSERT INTO SubjectAcademicPerformanceIndex (StudentId, SubjectId, SubjectScore) VALUES(NEW.StudentId, subject_id, new_subject_average) ON DUPLICATE KEY UPDATE SubjectScore = VALUES(SubjectScore);
END

CREATE DEFINER=`apwrg2ce352zfu2q`@`%` TRIGGER `nm96olu1l36pl3kh`.`StudentWritesTest_AFTER_DELETE` AFTER DELETE ON `StudentWritesTest` FOR EACH ROW
BEGIN
DECLARE new_subject_average FLOAT;
    DECLARE subject_id INT;
    
    SELECT SubjectId INTO subject_id FROM Test WHERE Id = OLD.TestId;
	
    SELECT AVG(ResultPercentage) INTO new_subject_average FROM StudentWritesTest WHERE StudentId = OLD.StudentId AND TestId IN(SELECT Id FROM Test WHERE SubjectId = subject_id);

	INSERT INTO SubjectAcademicPerformanceIndex (StudentId, SubjectId, SubjectScore) VALUES(OLD.StudentId, subject_id, new_subject_average) ON DUPLICATE KEY UPDATE SubjectScore = VALUES(SubjectScore);
END

------------StudentWritesCriteria---------------------------

CREATE DEFINER=`apwrg2ce352zfu2q`@`%` TRIGGER `nm96olu1l36pl3kh`.`StudentWritesCriteria_AFTER_INSERT` AFTER INSERT ON `StudentWritesCriteria` FOR EACH ROW
BEGIN
    DECLARE subject_id INT;
    DECLARE chapter_id INT;
    DECLARE topic_id INT;
    DECLARE topic_average FLOAT;

    SELECT ChapterId, TopicId INTO chapter_id, topic_id FROM Criteria WHERE Id = NEW.CriteriaId;
    SELECT SubjectId into subject_id FROM Chapter WHERE Id = chapter_id;

    SELECT AVG(ResultPercentage) INTO topic_average FROM StudentWritesCriteria WHERE StudentId = NEW.StudentId AND CriteriaId IN(SELECT CriteriaId FROM TopicHasCriteria WHERE TopicId = topic_id);

    INSERT INTO TopicPerformanceIndex(StudentId, TopicId, ChapterId, SubjectId, TestScore) VALUES(NEW.StudentId, topic_id, chapter_id, subject_id, topic_average) ON DUPLICATE KEY UPDATE TestScore = VALUES(TestScore);
END

CREATE DEFINER=`apwrg2ce352zfu2q`@`%` TRIGGER `nm96olu1l36pl3kh`.`StudentWritesCriteria_AFTER_INSERT` AFTER INSERT ON `StudentWritesCriteria` FOR EACH ROW
BEGIN
    DECLARE subject_id INT;
    DECLARE chapter_id INT;
    DECLARE topic_id INT;
    DECLARE topic_average FLOAT;

    SELECT ChapterId, TopicId INTO chapter_id, topic_id FROM TopicHasCriteria WHERE CriteriaId = NEW.CriteriaId;
    SELECT SubjectId into subject_id FROM Chapter WHERE Id = chapter_id;

    SELECT AVG(ResultPercentage) INTO topic_average FROM StudentWritesCriteria WHERE StudentId = NEW.StudentId AND CriteriaId IN(SELECT CriteriaId FROM TopicHasCriteria WHERE TopicId = topic_id);

    INSERT INTO TopicPerformanceIndex(StudentId, TopicId, ChapterId, SubjectId, TestScore) VALUES(NEW.StudentId, topic_id, chapter_id, subject_id, topic_average) ON DUPLICATE KEY UPDATE TestScore = VALUES(TestScore);
END

CREATE DEFINER=`ur80c8zso1xphigs`@`%` TRIGGER `ea6dy3u9gkie36cv`.`StudentWritesCriteria_AFTER_UPDATE` AFTER UPDATE ON `StudentWritesCriteria` FOR EACH ROW
BEGIN
	DECLARE subject_id INT;
    DECLARE chapter_id INT;
    DECLARE topic_id INT;
    DECLARE topic_average FLOAT;

    SELECT ChapterId, TopicId INTO chapter_id, topic_id FROM TopicHasCriteria WHERE CriteriaId = NEW.CriteriaId;
    SELECT SubjectId into subject_id FROM Chapter WHERE Id = chapter_id;

    SELECT AVG(ResultPercentage) INTO topic_average FROM StudentWritesCriteria WHERE StudentId = NEW.StudentId AND CriteriaId IN(SELECT CriteriaId FROM TopicHasCriteria WHERE TopicId = topic_id);

    INSERT INTO TopicPerformanceIndex(StudentId, TopicId, ChapterId, SubjectId, TestScore) VALUES(NEW.StudentId, topic_id, chapter_id, subject_id, topic_average) ON DUPLICATE KEY UPDATE TestScore = VALUES(TestScore);
END

CREATE DEFINER=`apwrg2ce352zfu2q`@`%` TRIGGER `nm96olu1l36pl3kh`.`StudentWritesCriteria_AFTER_DELETE` AFTER DELETE ON `StudentWritesCriteria` FOR EACH ROW
BEGIN
	UPDATE StudentWritesTest SET MarksObtained = IF(MarksObtained <> 'Ab', (MarksObtained - OLD.MarksScored), 'Ab'), ResultPercentage = IF(MarksObtained <> 'Ab', ((MarksObtained/max_marks) * 100), 0) WHERE TestId = OLD.TestId AND StudentId = OLD.StudentId;
END