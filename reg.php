<?php
	
	require_once ($cfg['data_library']."gsheet_api.php");  //Library untuk postback ke Gsheet google
	
	$dataUser 			= array('content' => $statcontent, 'info' => $fromsource, 'spare3' => $subscriberId);
	
	if($db->selectCountTable($cfg['table_user_active']," msisdn = '".$MT->msisdn."' AND id_service = '".$MT->id_service."'") < 1){
		$db->insertUser($cfg['table_user_active'], $MT, $dataUser);
	} else {
		$db->execute("UPDATE ".$cfg['table_user_active']." SET status = 1, command = 'reg', waktu = NOW(), spare1 = '".$statcontent."' WHERE msisdn = '".$MT->msisdn."' and id_service = '".$MT->id_service."'");
	}

	
	$isToken	= FALSE;
	
	if ( search_string($all_message, 'token=') ) {
		$isToken = TRUE;
		list($stringtoken, $valuetoken) = explode('token=', $all_message);
	}
	
	####GET PIXEL######################################################################################
	
	//GET PIXEL 
	$sqlpx 			= "SELECT clickid, adnet, refid FROM pixelview WHERE key_clickid = '".trim($valuetoken)."' AND operator = '".$MT->operator."' ORDER BY id DESC LIMIT 1";
	$get_result	 	= $db->row_result($sqlpx);
	$thispx 		= $get_result['clickid'];
	$thisadnet 		= $get_result['adnet'];
	$thisrefid 		= $get_result['refid'];
		
	$MT->trxid_partner = $thispx;

	if ( in_array(strtolower($thisrefid), array('cl_XXX')) ) { //tidak jadi dipakai
		
		/*
		$param = array(
					   'trxid'		=> $MT->id_create,
					   'serv_id'	=> 'mg1 cl',
					   'partner'	=> 'ytiselmk',
					   'msisdn'		=> $MT->msisdn,
					   'px'			=> $thispx
					);
		$hitlink	= "http://kbtools.net/id-ytiselmk.php?".http_build_query($param); 
		$isigm 		= curl_openlink($hitlink);
		$debug 		= $MT->id_service."|".$MT->msisdn."|".$all_message."|".$hitlink." | RESPONSE:".$isigm;
		logfile($debug, 'FORWARD_REG', 'LNKTADNET_FW_LOG');
		track_postback_adnet($db, $MT->id_create, 1, 1, $MT->id_service, $hitlink, $isigm, $thispx, '', 0, 'waki', $MT->msisdn);
		*/
		
	} else if ( in_array(strtolower($thisrefid), array('bg','cl','sly_XX','bb','msh','prt','yti','kl')) ) { 

		$param = array(
					   'aff_sub'	=> $thispx,
					   'method'		=> 'PIXEL'
					);
		$hitlink	= "https://pbk.wakicamp.com/v1/postback/?".http_build_query($param); 
		$isigm 		= curl_openlink($hitlink);
		$debug 		= $MT->id_service."|".$MT->msisdn."|".$all_message."|".$hitlink." | RESPONSE:".$isigm;
		logfile($debug, 'FORWARD_REG', 'LNKTADNET_FW_LOG');
		track_postback_adnet($db, $MT->id_create, 1, 1, $MT->id_service, $hitlink, $isigm, $thispx, '', 0, 'waki', $MT->msisdn);

	} else if ( in_array(strtolower($thisrefid), array('sly')) ) {   //postback ke GSHEET
		
		$msc1 			= microtime(true); 
		$adnetname		= 'waki'; 		
		$adnet_rasio 	= adnet_rasio($db, $adnetname, $MT->id_service, $MT->id_service);
		
		track_postback_adnet($db, $MT->id_create, 0, $adnet_rasio['sort_number'], $MT->id_service, '', '', $thispx, '', 0, $adnetname, $MT->msisdn);
		
		if ( $adnet_rasio['postback_send'] == 1 ) {  //USE RATIO
			
			$tz 	= new DateTimeZone('Asia/Jakarta'); 
			$now 	= new DateTime('now', $tz);
			
			$spreadsheetId 	= '1cPvNuXTy3EvUA5O5xtvzxQ1PNM0_1cl6rzBZm6o0Phc';  #gsheet Prod yg akan di isi
			$values 		= [[$thispx, "Sign-up (Offline + Manual Upload)", $now->format('Y-m-d\TH:i:sP'), "1", "IDR"]];
			
			$param = array(
						   'aff_sub'	=> $thispx,
						   'method'		=> 'PIXEL'
						);
			$hitlink	= "https://sheets.googleapis.com/v4/spreadsheets/?".http_build_query($param); 
			//$isigm 	= curl_openlink($hitlink);
			$isigm 		= gsheet_insert_row($spreadsheetId, $values);
			$msc1 		= microtime(true)-$msc1;
			$rapih		= json_encode(json_decode($isigm));
			$debug 		= $MT->id_service."|".$MT->msisdn."|".$all_message."|".$hitlink." | RESPONSE:".$rapih." | Response time: ".$msc1." sec";
			logfile($debug, 'FORWARD_REG', 'LNKTADNET_FW_LOG');
			
			$db->execute("UPDATE postback_transaction SET is_postback = '".$adnet_rasio['postback_send']."', postback_url = '".$hitlink."', postback_response = '".$isigm."' WHERE id_create = '".$MT->id_create."'");
			$db->execute("UPDATE ".$cfg['table_user_active']." SET spare3 = 'postback' WHERE msisdn = '".$MT->msisdn."' and id_service = '".$MT->id_service."'");
		
		}

	} else if ( in_array(strtolower($thisrefid), array('gs')) ) { 

		$param = array(
					   'token'		=> 'ef4c63d34ea2d4bfd32787df461247f3',
					   'click_id'	=> $thispx
					);
		$hitlink	= "http://adslab.gidpro.id/apb/cpvas?".http_build_query($param); 
		$isigm 		= curl_openlink($hitlink);
		$debug 		= $MT->id_service."|".$MT->msisdn."|".$all_message."|".$hitlink." | RESPONSE:".$isigm;
		logfile($debug, 'FORWARD_REG', 'LNKTADNET_FW_LOG');
		track_postback_adnet($db, $MT->id_create, 1, 1, $MT->id_service, $hitlink, $isigm, $thispx, '', 0, 'waki', $MT->msisdn);

	} else if ( in_array(strtolower($thisrefid), array('lb')) ) { 

		$param = array(
					   'token'		=> '7b3076f0455d5b831476fd3793357b71',
					   'click_id'	=> $thispx
					);
		$hitlink	= "http://adslab.gidpro.id/apb/cpvas?".http_build_query($param); 
		$isigm 		= curl_openlink($hitlink);
		$debug 		= $MT->id_service."|".$MT->msisdn."|".$all_message."|".$hitlink." | RESPONSE:".$isigm;
		logfile($debug, 'FORWARD_REG', 'LNKTADNET_FW_LOG');
		track_postback_adnet($db, $MT->id_create, 1, 1, $MT->id_service, $hitlink, $isigm, $thispx, '', 0, 'waki', $MT->msisdn);

	}	
	
	#######################################################################################################################
	
	
	####SENDING NOTIF TO GAMESC APPS #######################################################################################
	$msc3 		= microtime(true);
	$hitlink 	= "http://maingame.mobi/api/notification/subscribe?msisdn=".urlencode($MT->msisdn)."&package=daily";
	$isigm 		= curl_openlink($hitlink);
	$msc3 		= microtime(true)-$msc3;
	$debug 		= $MT->id_service."|".$MT->msisdn."|".$all_message."|".$hitlink." | RESPONSE: ".$isigm." | Resp Time : ".$msc3." sec,";
	logfile($debug, 'MAINGAME_REG', 'POST2PORTAL');
	#######################################################################################################################
	
	$pricepph 		= $MT->serviceprice * 1.11;
	$first_keyword 	= explode(' ', $MT->servicename)[0];
	$res_obj 		= json_decode($isigm);
	
	if ( isJson($isigm) ) {
		$kw = strtolower(trim(($_REQUEST['service'] ?? $_REQUEST['keyword'] ?? $keyword ?? '') . ' ' . ($first_keyword ?? '') . ' ' . ($MT->servicename ?? '') . ' ' . ($all_message ?? '')));

		if (preg_match('/\bmg1\b/i', $kw)) {
			$firstMT = "[2220] Ayo main game seru di https://maingame.mobi (berlaku trf internet) PIN: ".$res_obj->pin." Info/Unreg: UNREG<spasi>MG1 atau info langganan *500*7# Info lebih lanjut klik https://shorturl.at/meyTl  CS: 082125792213 Layanan ini sepenuhnya milik PT YATTA ERACIPTA SOLUSI";
			$MT->response_reg = $firstMT;
		} else if (preg_match('/\bmg2\b/i', $kw)) {
			$firstMT = "[1110] Ayo main game seru di https://maingame.mobi (berlaku trf internet) PIN: ".$res_obj->pin." Info/Unreg: UNREG<spasi>MG2 atau info langganan *500*7# Info lebih lanjut klik https://shorturl.at/meyTl  CS: 082125792213 Layanan ini sepenuhnya milik PT YATTA ERACIPTA SOLUSI";
			$MT->response_reg = $firstMT;
		} else if (preg_match('/\bmg\b/i', $kw)) {
			$firstMT = "[3330] Ayo main game seru di https://maingame.mobi (berlaku trf internet) PIN: ".$res_obj->pin." Info/Unreg: UNREG<spasi>MG atau info langganan *500*7# Info lebih lanjut klik https://shorturl.at/meyTl  CS: 082125792213 Layanan ini sepenuhnya milik PT YATTA ERACIPTA SOLUSI";
			$MT->response_reg = $firstMT;
		} else {
			$firstMT = "Yuk Main Games seru cuma ada di MAIN GAME klik http://maingame.mobi PIN anda : ".$res_obj->pin." Mainkan Sekarang!";
		}
	} else {
		$firstMT = "Yuk Main Games seru cuma ada di MAIN GAME klik http://maingame.mobi PIN anda : 132564 Mainkan Sekarang!";
	}
	
	firstSendMT($db, $cfg['temp_sms_send'], $MT, $firstMT, 'charge');

	$MT->message_out 	= $MT->response_reg;
	
	
	####GET ADNET & PUBID #####################################################################################################
	$db->execute("UPDATE ".$cfg['table_user_active']." SET adnet = '".$thisadnet."' WHERE msisdn = '".$MT->msisdn."' AND id_service = '".$MT->id_service."'");
	$MT->adnet = $thisadnet;
	###########################################################################################################################
	
	mo_forward($db, $MT, $owner_data, $keyword);  #MO FORWARD PARTNER
	
	
?>
