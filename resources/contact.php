
<?php
include_once "lib/class.phpmailer.php";
include_once "config.php";


function toJSON($error_exist, $error_no, $error_msg, $recover_suggestion, $data) {
    $ret = array();
    $ret['status'] = $error_exist == 0 ? 1 : 0;
    $ret['error_exist'] = $error_exist;
    $ret['error_no'] = $error_no;
    $ret['error_message'] = $error_msg;
    $ret['recover_suggestion'] = $recover_suggestion;
    $ret['data'] = $data;
    return json_encode($ret);
}

class RegistrationEmailTemplate {
    public function render($data) {
        $body = "";
        
        foreach($data as $key => $value){
            $body .= "<b>" . ucfirst($key) . ":</b> $value<br/><br/>";
        }
        return $body;
    }
}

$addresses = array(
    array('marketing@blueoctopus.com.my', 'Blue Octopus')
);

$addressesCC = array(
    //array('christina@infradesign.com.my', 'Christina')
);

if($config["isDev"] == true) {
    $addressesTest = array(
        array("jacky@infradesign.com.my", "Jacky Lee")
    );
    $addresses = $addressesTest;
    $addressesCC = $addressesTest;
}

$templateData = $_POST;
$template = new RegistrationEmailTemplate();
$body = $template->render($templateData);
$name = "no-reply@blueoctopus.com.my";
$sender = "no-reply@blueoctopus.com.my";
$subject = "Cyberia Crescent 1 Registration";

try {
    $mailer = new PHPMailer(true);
    $mailer->IsSMTP();
    $mailer->SMTPDebug = false;
    $mailer->SMTPAuth = true;
    $mailer->Host = $config['smtp']['host'];
    $mailer->Port = $config['smtp']['port'];
    $mailer->Username = $config['smtp']['user'];
    $mailer->Password = $config['smtp']['pass'];
    $mailer->CharSet = "UTF-8";
    $mailer->SetFrom($sender, $name);
    foreach($addresses as $k => $address) {
        $mailer->AddAddress($address[0], $address[1]);
    }
    foreach($addressesCC as $k => $address) {
        $mailer->AddCC($address[0], $address[1]);
    }
    $mailer->Subject = $subject;
    $mailer->MsgHTML($body);


    if(!$mailer->send()) {
        echo toJSON(1, 0, 'Error sending email', 'Please try again later', '');
    }else{
        echo toJSON(0, 0, 'Success', '', '');
    }

}catch(Exception $ex) {
    echo toJSON(1, 0, 'Error sending email : '.$ex->getMessage(), 'Please try again later', '');
}
?>