const BigNumber = require('bignumber.js');


function decodeValue(base, value) {
    return new BigNumber(value, base);
}


function lagrangeInterpolation(xPoints, yPoints, k, x) {
    let result = new BigNumber(0);

    for (let i = 0; i < k; i++) {
        let term = yPoints[i];

        for (let j = 0; j < k; j++) {
            if (i !== j) {
                let numerator = new BigNumber(x).minus(new BigNumber(xPoints[j]));
                let denominator = new BigNumber(xPoints[i]).minus(new BigNumber(xPoints[j]));
                term = term.multipliedBy(numerator).dividedBy(denominator);
            }
        }
        result = result.plus(term);
    }

    return result;
}


function findSecret(jsonData) {
    
    const n = jsonData.keys.n;
    const k = jsonData.keys.k;

    
    let xPoints = [];
    let yPoints = [];

    for (let key in jsonData) {
        if (key !== 'keys') {
            let x = parseInt(key); 
            let base = parseInt(jsonData[key].base);
            let value = jsonData[key].value; 
            let y = decodeValue(base, value);

            xPoints.push(x);
            yPoints.push(y);
        }
    }

    const secret = lagrangeInterpolation(xPoints.slice(0, k), yPoints.slice(0, k), k, 0);
    return secret.toFixed();  
}

function main() {
    const readline = require('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('Enter input JSON: ', (input) => {
        try {
            
            const jsonData = JSON.parse(input);

            const secret = findSecret(jsonData);
            console.log("The secret is:", secret);
        } catch (e) {
            console.log("Invalid input. Please provide valid JSON.");
        }

        rl.close();
    });
}

main();
