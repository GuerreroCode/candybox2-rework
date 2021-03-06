var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
///<reference path = "Item.ts"/>
var Token = /** @class */ (function (_super) {
    __extends(Token, _super);
    function Token(type) {
        if (type === void 0) { type = null; }
        var _this = _super.call(this, "token", //savingName
        "tokenName", //databaseName
        "tokenDescription", //databaseDescriptionName 
        "gridItems/token" //ascii 
        ) || this;
        _this.tokenType = null;
        _this.power = 2;
        //Unique variables
        //TODO make new(?) classes based on token type
        _this.currentTimer = 0;
        if (type == null) {
            _this.tokenType = Math.floor(Math.random() * 6);
        }
        else {
            _this.tokenType = type;
        }
        if (type == TokenType.NONE) {
            _this.power = 0;
        }
        else {
            _this.power = Math.floor((Math.random() * 10) + 1);
        }
        _this.setName();
        _this.maxTimer = 12 - _this.power;
        return _this;
    }
    Token.prototype.update = function (player, quest) {
        switch (this.tokenType) {
            case TokenType.REGEN: {
                player.heal(this.power / 5);
                break;
            }
            case TokenType.FIRE: {
                this.currentTimer += 1;
                // If the timer is ready
                if (this.currentTimer >= this.maxTimer) {
                    // Cast the fireball
                    this.castFireball(player, quest);
                    // Reset the timer
                    this.currentTimer = 0;
                }
                break;
            }
            case TokenType.PURPLE: {
                if (this.currentTimer < this.maxTimer)
                    this.currentTimer += 1;
                else {
                    this.currentTimer = 0;
                    var ent = this.getRandomEnemy(player, quest);
                    if (ent != null)
                        this.castPurpleBall(player, quest, ent);
                }
            }
            case TokenType.NONE: {
                break;
            }
        }
    };
    //public getters
    Token.prototype.getType = function () {
        return this.tokenType;
    };
    Token.prototype.getPower = function () {
        return this.power;
    };
    Token.prototype.getTokenName = function () {
        return this.tokenName;
    };
    //public setters
    Token.prototype.setType = function (tokenType) {
        this.tokenType = tokenType;
    };
    Token.prototype.setPower = function (power) {
        this.power = power;
    };
    Token.prototype.printType = function () {
        switch (this.tokenType) {
            case TokenType.NONE: {
                return "EMPTY";
            }
            case TokenType.STRENGTH: {
                return "STRENGTH";
            }
            case TokenType.SPEED: {
                return "SPEED";
            }
            case TokenType.REGEN: {
                return "REGENERATION";
            }
            case TokenType.FIRE: {
                return "FIREBALL";
            }
            case TokenType.PURPLE: {
                return "PURPLE MAGIC";
            }
        }
    };
    ///PRIVATE FUNCTIONS
    Token.prototype.setName = function (tokenName) {
        if (tokenName === void 0) { tokenName = null; }
        var retVal = "";
        if (tokenName == null) {
            switch (this.tokenType) {
                case TokenType.NONE: {
                    retVal += "NA";
                    break;
                }
                case TokenType.STRENGTH: {
                    retVal += "STR";
                    break;
                }
                case TokenType.SPEED: {
                    retVal += "SPD";
                    break;
                }
                case TokenType.REGEN: {
                    retVal += "RGN";
                    break;
                }
                case TokenType.FIRE: {
                    retVal += "FIR";
                    break;
                }
                case TokenType.PURPLE: {
                    retVal += "PRP";
                    break;
                }
            }
            retVal += this.power.toString() + Math.floor((Math.random() * 100) + 1); //ensures unique hashkey name
            this.tokenName = retVal;
        }
        else
            this.tokenName = tokenName;
    };
    //literally stolen from RedEnchantedGloves
    Token.prototype.castFireball = function (player, quest) {
        // Create the fireball
        var fireball = new Fireball(quest, player.getSpellCastingPosition(), new Naming("A small fireball", "a small fireball"), new Color(ColorType.RED_ENCHANTED_GLOVES_FIREBALL), new Pos(2, 1), this.power, // power directly correlletes for fireballs to make up for aimlessness
        player.getAndPossiblyCreateSpellCastingDamageReason(new Naming("A small fireball", "a small fireball")));
        // Set the direction
        fireball.setTargetTypeNoTarget(Algo.getRandomNotImmobileDirectionUpToThisSpeed(1).multiply(new Pos(2, 2)));
        // Add the entity
        quest.addEntity(fireball);
    };
    // MORE STOLEN METHODS FROM MonkeyWizardStaffMotherClass
    Token.prototype.castPurpleBall = function (player, quest, target, speed) {
        if (speed === void 0) { speed = new Pos(2, 1); }
        var ball = new Fireball(quest, player.getSpellCastingPosition(), new Naming("An magical purple ball", "a magical purple ball"), new Color(ColorType.MONKEY_WIZARD_BALL), new Pos(2, 1), this.power - (this.power / 3), //power is direct damage minus a few for balance 
        player.getAndPossiblyCreateSpellCastingDamageReason(new Naming("An magical purple ball", "a magical purple ball")));
        // Set the target
        ball.setTargetTypeTargetEntity(target, null, speed);
        // Add it to the quest
        quest.addEntity(ball);
    };
    Token.prototype.getRandomEnemy = function (player, quest) {
        // Array which will contain the indices (in the entities array) of all possible enemies
        var indices = [];
        // Fill the indices array
        for (var i = 0; i < quest.getEntities().length; i++) {
            // If this entity is destructible and is from a different team then the player
            if (quest.getEntities()[i].getDestructible() && quest.getEntities()[i].getTeam() != player.getTeam()) {
                // We add its index
                indices.push(i);
            }
        }
        // We return a random entity from the indices index
        if (indices.length > 0)
            return quest.getEntities()[indices[Random.between(0, indices.length - 1)]];
        else
            return null;
    };
    return Token;
}(Item));
//# sourceMappingURL=Token.js.map