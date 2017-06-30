
export class Util {

    static drawBitmapCenteredWithRotation(context: CanvasRenderingContext2D, bitmap: ImageBitmap, x: number, y: number, angle: number){
        context.save();
        context.translate( x, y);
        context.rotate(angle);
        context.drawImage( bitmap, -bitmap.width/2, -bitmap.height/2);
        context.restore();
    }

    static colorRect( context: CanvasRenderingContext2D, leftX: number, topY: number, width: number, height: number, drawColor: string){
        context.fillStyle = drawColor;
        context.fillRect(leftX, topY, width, height);
    } 

    static colorCircle(context: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number, drawColor: string){
        context.fillStyle = drawColor;
        context.beginPath();
        context.arc( centerX, centerY, radius, 0, Math.PI * 2, true);
        context.fill();
    }

    static colorText( context: CanvasRenderingContext2D, showWords: string, textX: number, textY: number, fillColor: string ){
        context.fillStyle = fillColor;
        context.fillText( showWords, textX, textY);
    }
}
