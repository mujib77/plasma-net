package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"sync"
	"time"
)

type SolarData struct {
	Speed   float64 `json:"speed"`
	Density float64 `json:"density"`
	Bz      float64 `json:"bz"`
	Bt      float64 `json:"bt"`
	Storm   bool    `json:"storm"`
	Updated string  `json:"updated"`
}

var (
	cache     SolarData
	cacheLock sync.RWMutex
)

func fetchNoaa(url string) ([][]interface{}, error) {
	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}
	var data [][]interface{}
	if err := json.Unmarshal(body, &data); err != nil {
		return nil, err
	}
	return data, nil
}

func updateCache() {
	magData, err := fetchNoaa("https://services.swpc.noaa.gov/products/solar-wind/mag-1-day.json")
	if err != nil {
		log.Println("mag fetch failed:", err)
		return
	}
	plasmaData, err := fetchNoaa("https://services.swpc.noaa.gov/products/solar-wind/plasma-1-day.json")
	if err != nil {
		log.Println("plasma fetch failed:", err)
		return
	}

	lastMag := magData[len(magData)-1]
	lastPlasma := plasmaData[len(plasmaData)-1]

	bz := toFloat(lastMag[3])
	bt := toFloat(lastMag[6])
	speed := toFloat(lastPlasma[2])
	density := toFloat(lastPlasma[1])

	cacheLock.Lock()
	cache = SolarData{
		Speed:   speed,
		Density: density,
		Bz:      bz,
		Bt:      bt,
		Storm:   bz < -10,
		Updated: time.Now().UTC().Format(time.RFC3339),
	}
	cacheLock.Unlock()

	log.Printf("cache updated — speed: %.0f km/s, bz: %.1f nT", speed, bz)
}

func toFloat(v interface{}) float64 {
	switch val := v.(type) {
	case float64:
		return val
	case string:
		var f float64
		fmt.Sscanf(val, "%f", &f)
		return f
	}
	return 0
}

func corsMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		next(w, r)
	}
}

func solarHandler(w http.ResponseWriter, r *http.Request) {
	cacheLock.RLock()
	data := cache
	cacheLock.RUnlock()
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data)
}

func main() {
	updateCache()

	go func() {
		ticker := time.NewTicker(60 * time.Second)
		for range ticker.C {
			updateCache()
		}
	}()

	http.HandleFunc("/api/solar", corsMiddleware(solarHandler))
	http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("ok"))
	})

	log.Println("plasma-net backend running on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}