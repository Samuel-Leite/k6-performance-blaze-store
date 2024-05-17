import http from "k6/http";
import { check, sleep, group } from "k6";
import { SharedArray } from "k6/data";
import exec from "k6/execution";

// configuracao
export const options = {
  stages: [
    { duration: "5m", target: 1000 },
    { duration: "24h", target: 1000 },
    { duration: "5m", target: 0 },
  ],
  thresholds: {
    checks: ["rate > 0.95"],
    http_req_failed: ["rate < 0.01"],
    http_req_duration: ["p(95) < 10000"],
  },
};

const BASE_URL = "https://api.demoblaze.com";

// configuracao
const data = new SharedArray("Arquivo dos produtos", function () {
  return JSON.parse(open("../../resources/produtos.json")).produtos;
});

// execucao
export default function () {
  
  group("Comprar produtos", function () {
    const produto = data[Math.floor(Math.random() * data.length)];

    const payload = JSON.stringify({
      id: produto.id,
      cookie: produto.cookie,
      prod_id: produto.prod_id,
      flag: produto.flag,
    });
    const params = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const res = http.post(`${BASE_URL}/addtocart`, payload, params);
    if (res.error) {
      exec.test.abort("Teste abortado. Aplicação está fora do ar");
    }

    check(res, {
      "Adicionado com sucesso o produto": (r) => r.status === 200,
    });
  });

  sleep(1);
}
