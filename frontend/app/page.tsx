import Link from "next/link";

export default function Home() {
  return (
      <main className="flex flex-col gap-8 items-center mt-20">
        <div>
          프론트엔드 개발자 김경민
        </div>
        <div className="text-center ">
          크로논랩스 과제 진행 <br/>
          Binance 거래소 페이지 구현하기
        </div>
        
        <div>
          <Link href='en/trade/BTCUSDT'>
            <button className="x-4 y-2 bg-pink-500 p-4">구현 페이지 바로가기</button>
          </Link>
        </div>
      </main>
  );
}
