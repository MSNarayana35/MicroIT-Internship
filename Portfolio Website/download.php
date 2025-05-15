<?php
$file_path = 'files/resume.pdf';

if (file_exists($file_path)) {
    header('Content-Description: File Transfer');
    header('Content-Type: application/pdf');
    header('Content-Disposition: attachment; filename="' . basename($file_path) . '"');
    header('Expires: 0');
    header('Cache-Control: must-revalidate');
    header('Pragma: public');
    header('Content-Length: ' . filesize($file_path));
    
    ob_clean();
    flush();
    
    readfile($file_path);
    exit;
} else {
    echo "<h2>File not found</h2>";
    echo "<p>The requested CV/resume file could not be found. Please try again later or contact the administrator.</p>";
    echo "<p><a href='index.html'>Return to homepage</a></p>";
}
?>