<?php
// Newsletter subscription handler
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = filter_var($_POST['email'] ?? '', FILTER_VALIDATE_EMAIL);
    
    if (!$email) {
        echo json_encode([
            'success' => false,
            'message' => 'E-mail inválido'
        ]);
        exit;
    }
    
    // Save to newsletter file
    if (!file_exists('data')) {
        mkdir('data', 0755, true);
    }
    
    $subscriber_data = [
        'email' => $email,
        'timestamp' => date('Y-m-d H:i:s'),
        'ip' => $_SERVER['REMOTE_ADDR']
    ];
    
    file_put_contents('data/newsletter.log', json_encode($subscriber_data) . "\n", FILE_APPEND);
    
    echo json_encode([
        'success' => true,
        'message' => 'Obrigado por se inscrever! Você receberá novidades sobre educação financeira infantil.'
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Método não permitido'
    ]);
}
?>
