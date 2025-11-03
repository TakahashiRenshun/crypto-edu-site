// Caesar/換字式暗号の関数をまとめて定義

// Default substitution key
const defaultSubstitutionKey = "QWERTYUIOPASDFGHJKLZXCVBNM";
let caesarMode = "encrypt";
let substitutionMode = "encrypt";
let rsaMode = "encrypt";
let scytaleMode = "encrypt";

function switchTab(tabName) {
	document
		.querySelectorAll(".tab-button")
		.forEach((btn) => btn.classList.remove("active"));
	event.target.classList.add("active");
	document
		.querySelectorAll(".cipher-section")
		.forEach((section) => section.classList.remove("active"));
	document.getElementById(tabName + "-section").classList.add("active");
}

function setCaesarMode(mode) {
	caesarMode = mode;
	document
		.querySelectorAll("#caesar-section .mode-btn")
		.forEach((btn) => btn.classList.remove("active"));
	event.target.classList.add("active");
	const inputLabel = document.getElementById("caesar-input-label");
	const outputLabel = document.getElementById("caesar-output-label");
	const inputField = document.getElementById("caesar-input");
	if (mode === "encrypt") {
		inputLabel.textContent = "平文（暗号化したい文字列）:";
		outputLabel.textContent = "暗号文（暗号化された文字列）:";
		inputField.placeholder = "暗号化したい文字列を入力してください...";
	} else {
		inputLabel.textContent = "暗号文（復号したい文字列）:";
		outputLabel.textContent = "平文（復号された文字列）:";
		inputField.placeholder = "復号したい文字列を入力してください...";
	}
	processCaesar();
}

function setSubstitutionMode(mode) {
	substitutionMode = mode;
	document
		.querySelectorAll("#substitution-section .mode-btn")
		.forEach((btn) => btn.classList.remove("active"));
	event.target.classList.add("active");
	const inputLabel = document.getElementById("substitution-input-label");
	const outputLabel = document.getElementById("substitution-output-label");
	const inputField = document.getElementById("substitution-input");
	if (mode === "encrypt") {
		inputLabel.textContent = "平文（暗号化したい文字列）:";
		outputLabel.textContent = "暗号文（暗号化された文字列）:";
		inputField.placeholder = "暗号化したい文字列を入力してください...";
	} else {
		inputLabel.textContent = "暗号文（復号したい文字列）:";
		outputLabel.textContent = "平文（復号された文字列）:";
		inputField.placeholder = "復号したい文字列を入力してください...";
	}
	processSubstitution();

	// 対応表の矢印をモードに応じて上下に切り替える（暗号化: ↓, 復号: ↑）
	try {
		const keyArrowEl = document.getElementById("key-display-text");
		if (keyArrowEl) {
			const arrowChar = mode === "encrypt" ? "\u2193" : "\u2191"; // ↓ または ↑
			keyArrowEl.textContent = Array(26).fill(arrowChar).join(" ");
		}
	} catch (e) {
		// DOM が未準備の場合は無視
		console.debug("key-display-text update skipped:", e);
	}
}

// --- RSA暗号機能追加 ---
function setRsaMode(mode) {
	rsaMode = mode;
	document
		.querySelectorAll("#rsa-section .mode-btn")
		.forEach((btn) => btn.classList.remove("active"));
	event.target.classList.add("active");
	const inputLabel = document.getElementById("rsa-input-label");
	const outputLabel = document.getElementById("rsa-output-label");
	const inputField = document.getElementById("rsa-input");
	if (mode === "encrypt") {
		inputLabel.textContent = "平文（暗号化したい文字列）:";
		outputLabel.textContent = "暗号文（暗号化された文字列）:";
		inputField.placeholder = "暗号化したい文字列を入力してください...";
	} else {
		inputLabel.textContent = "暗号文（復号したい文字列/カンマ区切り）:";
		outputLabel.textContent = "平文（復号された文字列）:";
		inputField.placeholder = "暗号文（カンマ区切り）を入力してください...";
	}
	processRsa();
}

// --- スキュタレー暗号機能追加 ---
function setScytaleMode(mode) {
	scytaleMode = mode;
	document
		.querySelectorAll("#scytale-section .mode-btn")
		.forEach((btn) => btn.classList.remove("active"));
	event.target.classList.add("active");
	const inputLabel = document.getElementById("scytale-input-label");
	const outputLabel = document.getElementById("scytale-output-label");
	const inputField = document.getElementById("scytale-input");
	if (mode === "encrypt") {
		inputLabel.textContent = "平文（暗号化したい文字列）:";
		outputLabel.textContent = "暗号文（暗号化された文字列）:";
		inputField.placeholder = "暗号化したい文字列を入力してください...";
	} else {
		inputLabel.textContent = "暗号文（復号したい文字列）:";
		outputLabel.textContent = "平文（復号された文字列）:";
		inputField.placeholder = "復号したい文字列を入力してください...";
	}
	processScytale();
}

function processCaesar() {
	const input = document.getElementById("caesar-input").value;
	const shift = parseInt(document.getElementById("shift").value) || 3;
	let result;
	if (caesarMode === "encrypt") {
		result = caesarCipher(input, shift);
	} else {
		result = caesarCipher(input, -shift);
	}
	document.getElementById("caesar-output").value =
		result ||
		(caesarMode === "encrypt"
			? "ここに暗号化された文字列が表示されます"
			: "ここに復号された文字列が表示されます");
}

function caesarCipher(text, shift) {
	if (!text) return "";
	shift = ((shift % 26) + 26) % 26;
	return text
		.split("")
		.map((char) => {
			if (char >= "A" && char <= "Z") {
				return String.fromCharCode(
					((char.charCodeAt(0) - 65 + shift) % 26) + 65
				);
			} else if (char >= "a" && char <= "z") {
				return String.fromCharCode(
					((char.charCodeAt(0) - 97 + shift) % 26) + 97
				);
			} else {
				return char;
			}
		})
		.join("");
}

function resetCaesar() {
	document.getElementById("caesar-input").value = "";
	document.getElementById("shift").value = "3";
	document.getElementById("caesar-output").value =
		caesarMode === "encrypt"
			? "ここに暗号化された文字列が表示されます"
			: "ここに復号された文字列が表示されます";
}

function processSubstitution() {
	const input = document.getElementById("substitution-input").value;
	const key = document.getElementById("substitution-key").value.toUpperCase();
	updateKeyDisplay(key);
	if (key.length !== 26) {
		document.getElementById("substitution-output").value =
			"キーは26文字のアルファベットで入力してください";
		return;
	}
	const uniqueChars = new Set(key);
	if (uniqueChars.size !== 26) {
		document.getElementById("substitution-output").value =
			"キーに重複する文字があります";
		return;
	}
	if (!/^[A-Z]{26}$/.test(key)) {
		document.getElementById("substitution-output").value =
			"キーはアルファベットのみで入力してください";
		return;
	}
	let result;
	if (substitutionMode === "encrypt") {
		result = substitutionCipher(input, key);
	} else {
		result = substitutionDecipher(input, key);
	}
	document.getElementById("substitution-output").value =
		result ||
		(substitutionMode === "encrypt"
			? "ここに暗号化された文字列が表示されます"
			: "ここに復号された文字列が表示されます");
}

function substitutionCipher(text, key) {
	if (!text || !key) return "";
	const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	return text
		.split("")
		.map((char) => {
			if (char >= "A" && char <= "Z") {
				const index = char.charCodeAt(0) - 65;
				return key[index];
			} else if (char >= "a" && char <= "z") {
				const index = char.charCodeAt(0) - 97;
				return key[index].toLowerCase();
			} else {
				return char;
			}
		})
		.join("");
}

function substitutionDecipher(text, key) {
	if (!text || !key) return "";
	const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	return text
		.split("")
		.map((char) => {
			if (char >= "A" && char <= "Z") {
				const index = key.indexOf(char);
				return index !== -1 ? alphabet[index] : char;
			} else if (char >= "a" && char <= "z") {
				const index = key.indexOf(char.toUpperCase());
				return index !== -1 ? alphabet[index].toLowerCase() : char;
			} else {
				return char;
			}
		})
		.join("");
}

function updateKeyDisplay(key) {
	const display = document.getElementById("substitution-display");
	if (key.length === 26) {
		display.textContent = key.split("").join(" ");
		display.style.color = "#2d3748";
	} else {
		display.textContent =
			key.split("").join(" ") + " ".repeat(Math.max(0, (26 - key.length) * 2));
		display.style.color = "#a0aec0";
	}
}

function selectKeyByNumber() {
	const keyNumber = parseInt(document.getElementById("key-number").value) || 1;
	if (keyNumber >= 1 && keyNumber <= 300 && SUBSTITUTION_KEYS) {
		const selectedKey = SUBSTITUTION_KEYS[keyNumber - 1];
		document.getElementById("substitution-key").value = selectedKey;
		processSubstitution();
	} else {
		document.getElementById("substitution-output").value =
			"キー番号は1-300の範囲で入力してください";
	}
}

function generateRandomKey() {
	const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
	for (let i = alphabet.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[alphabet[i], alphabet[j]] = [alphabet[j], alphabet[i]];
	}
	const randomKey = alphabet.join("");
	document.getElementById("substitution-key").value = randomKey;
	processSubstitution();
}

function resetSubstitution() {
	document.getElementById("substitution-input").value = "";
	document.getElementById("substitution-key").value = defaultSubstitutionKey;
	document.getElementById("key-number").value = 1; // キー番号を1にリセット
	processSubstitution();
}

// RSA暗号機能追加ここから
function processRsa() {
	const input = document.getElementById("rsa-input").value;
	const pub = document.getElementById("rsa-public-key").value.split(",");
	const priv = document.getElementById("rsa-private-key").value.split(",");
	let n, e, d;
	let result = "";
	if (rsaMode === "encrypt") {
		if (pub.length !== 2 || isNaN(pub[0]) || isNaN(pub[1])) {
			document.getElementById("rsa-output").value =
				"公開鍵(n,e)を正しく入力してください";
			return;
		}
		n = BigInt(pub[0]);
		e = BigInt(pub[1]);
		result = rsaEncrypt(input, n, e);
	} else {
		if (priv.length !== 2 || isNaN(priv[0]) || isNaN(priv[1])) {
			document.getElementById("rsa-output").value =
				"秘密鍵(n,d)を正しく入力してください";
			return;
		}
		n = BigInt(priv[0]);
		d = BigInt(priv[1]);
		result = rsaDecrypt(input, n, d);
	}
	document.getElementById("rsa-output").value =
		result ||
		(rsaMode === "encrypt"
			? "ここに暗号化された文字列が表示されます"
			: "ここに復号された文字列が表示されます");
}

function rsaEncrypt(plain, n, e) {
	// 1文字ずつ数値化し暗号化、カンマ区切りで返す
	const codes = [];
	for (let i = 0; i < plain.length; i++) {
		const m = BigInt(plain.charCodeAt(i));
		const c = modPow(m, e, n);
		codes.push(c.toString());
	}
	return codes.join(",");
}

function rsaDecrypt(cipher, n, d) {
	// カンマ区切りの数値列を復号
	if (!cipher) return "";
	const parts = cipher.split(",");
	let result = "";
	for (let i = 0; i < parts.length; i++) {
		const c = BigInt(parts[i]);
		const m = modPow(c, d, n);
		result += String.fromCharCode(Number(m));
	}
	return result;
}

// 簡易modPow（繰り返し二乗法）
function modPow(base, exp, mod) {
	let result = 1n;
	base = base % mod;
	while (exp > 0) {
		if (exp % 2n === 1n) result = (result * base) % mod;
		exp = exp / 2n;
		base = (base * base) % mod;
	}
	return result;
}

function generateRsaKey() {
	// 体験用に複数の小さなRSA鍵セットからランダムで1つ選ぶ
	const keyList = [
		{ n: 3233, e: 17, d: 413 }, // p=61, q=53
		{ n: 2773, e: 17, d: 157 }, // p=47, q=59
		{ n: 3127, e: 3, d: 2011 }, // p=53, q=59
		{ n: 2537, e: 13, d: 937 }, // p=43, q=59
		{ n: 187, e: 3, d: 107 }, // p=11, q=17
		{ n: 589, e: 7, d: 463 }, // p=19, q=31
		{ n: 667, e: 3, d: 443 }, // p=23, q=29
		{ n: 1147, e: 5, d: 229 }, // p=31, q=37
		{ n: 2021, e: 11, d: 1103 }, // p=43, q=47
		{ n: 221, e: 5, d: 77 }, // p=13, q=17
	];
	const key = keyList[Math.floor(Math.random() * keyList.length)];
	document.getElementById("rsa-public-key").value = `${key.n},${key.e}`;
	document.getElementById("rsa-private-key").value = `${key.n},${key.d}`;
	processRsa();
}

function resetRsa() {
	document.getElementById("rsa-input").value = "";
	document.getElementById("rsa-public-key").value = "";
	document.getElementById("rsa-private-key").value = "";
	document.getElementById("rsa-output").value =
		rsaMode === "encrypt"
			? "ここに暗号化された文字列が表示されます"
			: "ここに復号された文字列が表示されます";
}

function toggleRsaKeyVisibility() {
	const keyInput = document.getElementById("rsa-private-key");
	const btn = document.getElementById("toggle-rsa-key-visibility");
	if (keyInput.type === "password") {
		keyInput.type = "text";
		btn.textContent = "非表示";
	} else {
		keyInput.type = "password";
		btn.textContent = "表示";
	}
}

function copyToClipboard(elementId) {}

function processScytale() {
	const input = document.getElementById("scytale-input").value;
	const rows = parseInt(document.getElementById("scytale-rows").value) || 4;
	let result = "";
	if (scytaleMode === "encrypt") {
		result = scytaleEncrypt(input, rows);
		renderScytaleMatrix(input, rows, true);
	} else {
		result = scytaleDecrypt(input, rows);
		renderScytaleMatrix(input, rows, false);
	}
	document.getElementById("scytale-output").value =
		result ||
		(scytaleMode === "encrypt"
			? "ここに暗号化された文字列が表示されます"
			: "ここに復号された文字列が表示されます");
}

function renderScytaleMatrix(text, rows, isEncrypt) {
	// const matrixDiv = document.getElementById("scytale-matrix");
	// matrixDiv.innerHTML = "";
	// if (!text) return;
	// let cols = Math.ceil(text.length / rows);
	// let table = document.createElement("table");
	// table.className = "scytale-table";
	// if (isEncrypt) {
	// 	// 暗号化時: 行ごとに分割
	// 	for (let r = 0; r < rows; r++) {
	// 		let tr = document.createElement("tr");
	// 		for (let c = 0; c < cols; c++) {
	// 			let idx = c * rows + r;
	// 			let td = document.createElement("td");
	// 			td.textContent = text[idx] ? text[idx] : "";
	// 			tr.appendChild(td);
	// 		}
	// 		table.appendChild(tr);
	// 	}
	// } else {
	// 	// 復号時: 列ごとに分割
	// 	let arr = Array.from({ length: rows }, () => "");
	// 	let idx = 0;
	// 	for (let r = 0; r < rows; r++) {
	// 		let len = cols;
	// 		if (r >= text.length % rows && text.length % rows !== 0) len--;
	// 		arr[r] = text.slice(idx, idx + len);
	// 		idx += len;
	// 	}
	// 	for (let r = 0; r < rows; r++) {
	// 		let tr = document.createElement("tr");
	// 		for (let c = 0; c < cols; c++) {
	// 			let td = document.createElement("td");
	// 			td.textContent = arr[r][c] ? arr[r][c] : "";
	// 			tr.appendChild(td);
	// 		}
	// 		table.appendChild(tr);
	// 	}
	// }
	// matrixDiv.appendChild(table);
}

function scytaleEncrypt(text, rows) {
	if (!text) return "";
	let cols = Math.ceil(text.length / rows);
	let arr = Array.from({ length: rows }, () => "");
	for (let i = 0; i < text.length; i++) {
		arr[i % rows] += text[i];
	}
	return arr.join("");
}

function scytaleDecrypt(cipher, rows) {
	if (!cipher) return "";
	let cols = Math.ceil(cipher.length / rows);
	let arr = Array.from({ length: rows }, () => "");
	let idx = 0;
	for (let r = 0; r < rows; r++) {
		let len = cols;
		if (r >= cipher.length % rows && cipher.length % rows !== 0) len--;
		arr[r] = cipher.slice(idx, idx + len);
		idx += len;
	}
	let result = "";
	for (let c = 0; c < cols; c++) {
		for (let r = 0; r < rows; r++) {
			if (arr[r][c]) result += arr[r][c];
		}
	}
	return result;
}

function resetScytale() {
	document.getElementById("scytale-input").value = "";
	document.getElementById("scytale-rows").value = 4;
	document.getElementById("scytale-output").value =
		scytaleMode === "encrypt"
			? "ここに暗号化された文字列が表示されます"
			: "ここに復号された文字列が表示されます";
}

window.onload = function () {
	document.getElementById("caesar-input").value = "HELLO WORLD";
	processCaesar();
	document.getElementById("substitution-key").value = defaultSubstitutionKey;
	document.getElementById("substitution-input").value = "HELLO WORLD";
	processSubstitution();
	document.getElementById("scytale-input").value = "HELLO WORLD";
	processScytale();
};
