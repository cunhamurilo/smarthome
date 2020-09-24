//Bibliotecas
#include <ESP8266WiFi.h>   

#include <DNSServer.h> 
#include <WiFiManager.h>
#include <FirebaseArduino.h>

#include <ESP8266HTTPClient.h>
#include <Arduino.h>

#include <ESP8266httpUpdate.h>
#include <EEPROM.h>

int ledVerm = 16;
int ledVerd = 5;
int button = 4;
 
WiFiManager wifiManager;//Objeto de manipulação do wi-fi

#define FIREBASE_HOST "Add your firebase host"
#define FIREBASE_AUTH "Add your firebase auth"
#define file "Add your link to firebase storage"
#define users "Add your link to firebase database"
#define traits "Add your link to traits for a device?auth="+FIREBASE_AUTH

#define rele1 2     // d4
#define rele2 14    // d5
#define rele3 12    // d6
#define rele4 13    // d7

unsigned long millisServer = millis();

String id = String(ESP.getFlashChipId());
String path = "";
String responsePath = "";
int responseNumId = 0;

std::unique_ptr<BearSSL::WiFiClientSecure>client(new BearSSL::WiFiClientSecure);
HTTPClient https;

void setup(){
   
  Serial.begin(115200);
  Serial.println();
 
  //Definição dos pinos
  pinMode(button,INPUT);
  pinMode(ledVerm,OUTPUT); 
  pinMode(ledVerd,OUTPUT);
  
  //Definição dos reles
  pinMode(rele1,OUTPUT); 
  pinMode(rele2,OUTPUT);
  pinMode(rele3,OUTPUT); 
  pinMode(rele4,OUTPUT);
 
  //LEDs apagados
  digitalWrite(ledVerd,LOW);
  digitalWrite(ledVerm,LOW);

  //reles desligados
  digitalWrite(rele1,HIGH);
  digitalWrite(rele2,HIGH);
  digitalWrite(rele3,HIGH);
  digitalWrite(rele4,HIGH);

  delay(500);
  if (WiFi.SSID() != "") {
     Serial.println("teste 2");
     Serial.println("conectando wifi");
     int cont = 0;
     while(WiFi.status() != WL_CONNECTED && cont < 500){
       digitalWrite(ledVerm,HIGH);
      delay(50);
      digitalWrite(ledVerm,LOW);
      delay(50);
        Serial.print(".");
        cont++;
     }
     if(cont > 499){
      wifiManager.resetSettings();
     }else{
       Serial.println("conectado.");
       Serial.println(WiFi.localIP());
       path = "Add your link to firebase database for a path of device"+id; 
       responsePath = getHttp(path+"/path.json");
       responseNumId = getHttp(path+"/numId.json").toInt();
       responsePath.replace("\"", ""); 
        
       EEPROM.begin(4); // Inicializa a EEPROM para a versão
     }
  }
}
 
void loop() {
 
   //Se o botão for pressionado
   if (digitalRead(button) == HIGH) {
      Serial.println("Abertura Portal"); //Abre o portal
      digitalWrite(ledVerm,HIGH); //Acende LED Vermelho
      digitalWrite(ledVerd,LOW);
      wifiManager.resetSettings();       //Apaga rede salva anteriormente
      delay(20);
      
      //callback para quando entra em modo de configuração AP
      wifiManager.setAPCallback(configModeCallback); 
      //callback para quando se conecta em uma rede, ou seja, quando passa a trabalhar em modo estação
      wifiManager.setSaveConfigCallback(saveConfigCallback); 
      
      if(!wifiManager.autoConnect("ESP_AP", "12345678") ){ //Nome da Rede e Senha gerada pela ESP
        Serial.println("Falha ao conectar"); //Se caso não conectar na rede mostra mensagem de falha
        delay(2000);
        wifiManager.resetSettings();  
        ESP.reset(); //Reinicia ESP após não conseguir conexão na rede
      }
      else{       //Se caso conectar 
        Serial.println("Conectado na Rede!!!");
        
        String path = "Add your link to firebase database";
        String responseBody = getHttp(path+"Add child with name of available devices.json");
        StaticJsonBuffer<500> jsonBuffer;
        JsonObject& json = jsonBuffer.parseObject(responseBody);
        
        Serial.print("jsonObject: ");
        int children = json.size();
        Serial.println(children);
        String device = "Add child with name of available devices";
        device+=children;
        patchHttp(path+device+".json", "{\"id\":\""+id+"\"}");
        
        ESP.restart(); //Reinicia ESP após conseguir conexão na rede 
        delay(1000);
      }
   }
 
   if(WiFi.status()== WL_CONNECTED){ //Se conectado na rede
      //Serial.println("Conectado na Rede!!! Wifi");
      digitalWrite(ledVerm,LOW); //Apaga LED VERMELHO
      digitalWrite(ledVerd,HIGH); //Acende LED VERDE

      if(millis() - millisServer > 86400000){
          client->setInsecure();
          uint8_t versao = EEPROM.read(0);
          String pathUpdate = file;
          pathUpdate += "Add your token for item in firebase storage";
          uint8_t versaoSite = getHttp(pathUpdate).toInt();
          Serial.println(versaoSite);
          Serial.print("EEPROM version:");
          Serial.println(versao);
          if(versaoSite != versao){
             Serial.println("Versoes diferentes");
                       
             EEPROM.write(0, versaoSite);
             EEPROM.commit();
                       
             t_httpUpdate_return ret;
             pathUpdate = file;
             pathUpdate += "Add your token for item in firebase storage";
             ret = ESPhttpUpdate.update(*client, pathUpdate);
             if(ret != HTTP_UPDATE_OK){
                 Serial.print("Falha na atualização: ");
                 Serial.print(ESPhttpUpdate.getLastError());
                 Serial.println(ESPhttpUpdate.getLastErrorString());
              }
          }        
          client->flush();
          client->stop();
       
          millisServer = millis();
      } 
      Serial.println("firebase");
      if(!responsePath.equals("")){
           int numId = responseNumId;
           String onOff = "";
           String responseOnOff = "";
           
           onOff = users+responsePath+numId+traits;
           responseOnOff = getHttp(onOff);
           setOnOff(responseOnOff, rele1);
           numId++;
           
           onOff = users+responsePath+numId+traits;
           responseOnOff = getHttp(onOff);
           setOnOff(responseOnOff, rele2);
           numId++;
           
           onOff = users+responsePath+numId+traits;
           responseOnOff = getHttp(onOff);
           setOnOff(responseOnOff, rele3);
           numId++;
           
           onOff = users+responsePath+numId+traits;
           responseOnOff = getHttp(onOff);
           setOnOff(responseOnOff, rele4);
      }
   
   }else{ //se não conectado na rede
      Serial.println("não conectado na Rede!!!");
      digitalWrite(ledVerd,LOW); //Apaga LED VERDE
      //Pisca LED Vermelho
      digitalWrite(ledVerm,HIGH);
      delay(500);
      digitalWrite(ledVerm,LOW);
      delay(500);
      if (WiFi.SSID() != "") {
        Serial.print("Trying to connect to "); 
        Serial.println( WiFi.SSID());
      }
      
   }
   delay(10);
}

String getHttp(String path){
  
   ESP.resetFreeContStack();
   String payload = "";
   client->setInsecure();
   
   //Serial.print("[HTTPS] begin...\n");
   if (https.begin(*client, path)) {  // HTTPS
      //Serial.print("[HTTPS] GET...\n");
      // start connection and send HTTP header
      int httpCode = https.GET();
      // httpCode will be negative on error
        
      if (httpCode > 0) {
        // HTTP header has been send and Server response header has been handled
        //Serial.printf("[HTTPS] GET... code: %d\n", httpCode);

        // file found at server
        if (httpCode == HTTP_CODE_OK || httpCode == HTTP_CODE_MOVED_PERMANENTLY) {
            payload = https.getString();
            Serial.println(payload);
        }
      } else {
         Serial.printf("[HTTPS] GET... failed, error: %s\n", https.errorToString(httpCode).c_str());
      }
      
      https.end();
      client->flush();
      client->stop();
      //Serial.print("[HTTPS] CLOSE...\n");
   } else {
        Serial.printf("[HTTPS] Unable to connect\n");
   }

   ESP.resetFreeContStack();
   return payload;
}

void patchHttp(String path, String value){
  
   ESP.resetFreeContStack();
   client->setInsecure();

   //Serial.print("[HTTPS] begin...\n");
   if (https.begin(*client, path)) {  // HTTPS
      //Serial.print("[HTTPS] GET...\n");
      // start connection and send HTTP header
      
      https.addHeader("Content-Type", "application/json");
      int httpResponseCode = https.PATCH(value);
      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
      
      https.end();
      client->flush();
      client->stop();
     // Serial.print("[HTTPS] CLOSE...\n");
   } else {
        Serial.printf("[HTTPS] Unable to connect\n");
   }

   ESP.resetFreeContStack();
}

void setOnOff(String onOff, int rele){
  if(onOff.equals("false"))
    digitalWrite(rele,HIGH);
  else
    digitalWrite(rele,LOW);
}
 
//callback que indica que o ESP entrou no modo AP
void configModeCallback (WiFiManager *myWiFiManager) {  
  Serial.println("Entrou no modo de configuração");
  Serial.println(WiFi.softAPIP()); //imprime o IP do AP
  Serial.println(myWiFiManager->getConfigPortalSSID()); //imprime o SSID criado da rede
}
 
//Callback que indica que salvamos uma nova rede para se conectar (modo estação)
void saveConfigCallback () {
  Serial.println("Configuração salva");
}
