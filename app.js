function Konyv(cim, szerzo, kiadasiEv, oldalszam, kolcsonozve) {
    this.cim = cim;
    this.szerzo = szerzo;
    this.kiadasiEv = Number(kiadasiEv);
    this.oldalszam = Number(oldalszam);
    this.kolcsonozve = false;
    this.kategoria = "Egyéb";
    this.kolcsonoz = function () {
        if (this.kolcsonozve) { return false; }
        this.kolcsonozve = true;
        return true;
    };
    this.visszahoz = function () {
        if (!this.kolcsonozve) { return false; }
        this.kolcsonozve = false;
        return true;
    };
}

const konyvek = [
    new Konyv("Egri csillagok", "Gárdonyi Géza", 1901, 650),
    new Konyv("A nagy Gatsby", "F. Scott Fitzgerald", 1925, 180),
    new Konyv("A kis herceg", "Antoine de Saint-Exupéry", 1943, 96),
    new Konyv("A Gyűrűk Ura: A Gyűrű Szövetsége", "J.R.R. Tolkien", 1954, 480)
];

const konyvTablazatMegjelenites = document.getElementById("konyvTablazatMegjelenites");
const konyvHibaUzenet = document.getElementById("konyvHibaUzenet");

function konyvekMegjelenitese(szurtLista = null) {
    
    konyvTablazatMegjelenites.replaceChildren();
    const listaMegjelenitesre = szurtLista || konyvek;
    
    listaMegjelenitesre.forEach(function (konyv) {
        const sor = document.createElement("tr");
        sor.className = "bg-white border-b border-gray-200 hover:bg-gray-50";
        
        [konyv.cim, konyv.szerzo, konyv.kiadasiEv, konyv.oldalszam, konyv.kategoria].forEach(function (adat, index) {
            const cella = document.createElement("td");
            cella.className = index === 0 ? "px-6 py-4 font-medium text-gray-900 whitespace-nowrap" : "px-6 py-4";
            cella.textContent = adat;
            sor.appendChild(cella);
        });

        // Állapot
        const allapotCella = document.createElement("td");
        allapotCella.className = "p-4 " + (konyv.kolcsonozve ? "text-red-600" : "text-green-600");
        allapotCella.textContent = konyv.kolcsonozve ? "Kölcsönözve" : "Szabad";
        sor.appendChild(allapotCella);

        // Művelet gomb
        const muveletCella = document.createElement("td");
        muveletCella.className = "p-4";
        const gomb = document.createElement("button");
        gomb.type = "button";
        gomb.className = "font-medium text-blue-700 hover:underline cursor-pointer";
        gomb.textContent = konyv.kolcsonozve ? "Visszahozás" : "Kölcsönzés";
        
        gomb.addEventListener("click", function () {
            if (konyv.kolcsonozve) {
                konyv.visszahoz();
            } else {
                konyv.kolcsonoz();
            }
            if (konyvHibaUzenet) konyvHibaUzenet.textContent = "";
            konyvekMegjelenitese();
        });
        
        muveletCella.appendChild(gomb);
        sor.appendChild(muveletCella);
        konyvTablazatMegjelenites.appendChild(sor);
    });
}

function konyvMent(event) {
    if(event) event.preventDefault();
    try {
        const cim = document.getElementById("cim").value.trim();
        const szerzo = document.getElementById("szerzo").value.trim();
        const kiadasiEv = document.getElementById("kiadasiev").valueAsNumber;
        const oldalszam = document.getElementById("oldalszam").valueAsNumber;

        if (!cim) { throw new Error("A cím megadása kötelező."); }
        if (!szerzo) { throw new Error("A szerző megadása kötelező."); }
        if (!Number.isInteger(kiadasiEv) || kiadasiEv < 1) { throw new Error("Adj meg érvényes kiadási évet."); }
        if (!Number.isInteger(oldalszam) || oldalszam < 1) { throw new Error("Az oldalszám pozitív egész szám legyen."); }

        const ujKonyv = new Konyv(cim, szerzo, kiadasiEv, oldalszam);
        konyvek.push(ujKonyv);
        
        if (konyvHibaUzenet) konyvHibaUzenet.textContent = "";
        document.querySelector("#konyvForm")?.reset(); // Célzottabb form reset
        konyvekMegjelenitese();
    } catch (hiba) {
        if (konyvHibaUzenet) konyvHibaUzenet.textContent = `Hiba: ${hiba.message}`;
    }
}

function osszesKonyv() {
    if (konyvHibaUzenet) konyvHibaUzenet.innerHTML = "";
    konyvekMegjelenitese(konyvek);
}

konyvekMegjelenitese();