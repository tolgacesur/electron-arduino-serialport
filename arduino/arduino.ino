#include <Arduino.h>

#define LED_RED     13
#define LED_GREEN   12
#define LED_BLUE    14

void setup() {
  Serial.begin(115200);

  pinMode(LED_RED, OUTPUT);
  pinMode(LED_GREEN, OUTPUT);
  pinMode(LED_BLUE, OUTPUT);
}

void loop() {
  if (Serial.available() > 0) {
    String hexstring = Serial.readString();

    long rgb = strtoll(&hexstring[1], NULL, 16);
    long r = rgb >> 16;
    long g = rgb >> 8 & 0xFF;
    long b = rgb & 0xFF;
  
    r = map(r, 0, 255, 1023, 0);
    g = map(g, 0, 255, 1023, 0);
    b = map(b, 0, 255, 1023, 0);
  
    analogWrite(LED_RED, r);
    analogWrite(LED_GREEN, g);
    analogWrite(LED_BLUE, b);
  }
}
