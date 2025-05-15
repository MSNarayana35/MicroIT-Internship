<?php
$host = 'localhost';
$username = 'root';
$password = '';
$database = 'eportfolio';

try {
    $conn = new PDO("mysql:host=$host;dbname=$database", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    error_log("Connection failed: " . $e->getMessage());
}

function getResumeFile() {
    global $conn;
    try {
        $stmt = $conn->prepare("SELECT id, filename, filepath FROM resume_files ORDER BY id DESC LIMIT 1");
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    } catch(PDOException $e) {
        error_log("Error fetching resume: " . $e->getMessage());
        return false;
    }
}

function logDownload($file_id, $ip_address) {
    global $conn;
    try {
        $stmt = $conn->prepare("INSERT INTO download_logs (file_id, ip_address, download_date) VALUES (:file_id, :ip_address, NOW())");
        $stmt->bindParam(':file_id', $file_id);
        $stmt->bindParam(':ip_address', $ip_address);
        $stmt->execute();
        return true;
    } catch(PDOException $e) {
        error_log("Error logging download: " . $e->getMessage());
        return false;
    }
}
?>