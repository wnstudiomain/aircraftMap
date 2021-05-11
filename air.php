<?php
header('Access-Control-Allow-Origin: *');
if (isset($_POST["flight"]))
{
    $flight = $_POST["flight"];
}

$url = 'https://www.flightradar24.com/v1/search/web/find?query='.$flight.'&limit=5';
$curl = curl_init($url);
curl_setopt($curl, CURLOPT_HTTPHEADER, array('Accept: application/json'));
curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
$data = curl_exec($curl);
$std=json_decode($data,true);
curl_close($curl);
$pattern = "/^([a-z0-9]+){8}/";
$flyid = null;
foreach ($std as $key => $val) {
    foreach ($val as $key1 => $val1) {
        foreach ($val1 as $key2 => $val2) {
            if ($key2 == 'id' and preg_match($pattern, $val2)) {
                $flyid = $val2;
            }
        }
    }
}
$url1 = 'https://data-live.flightradar24.com/clickhandler/?version=1.5&flight='.$flyid.'';
$curl1 = curl_init($url1);
curl_setopt($curl1, CURLOPT_HTTPHEADER, array('Accept: application/json'));
curl_setopt($curl1, CURLOPT_RETURNTRANSFER, 1);
$data1 = curl_exec($curl1);
$std1=json_decode($data1,true);
unset($std1['trail']);
echo json_encode($std1);


curl_close($curl1);
?>


