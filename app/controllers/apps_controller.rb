class AppsController < ApplicationController

  def index
    @apps = App.all
  end

  def new
    @app = App.new
  end

  def edit
    @app = App.find_by!(uid: params[:id])
  end

  def logs
    @app = App.find_by!(uid: params[:app_id])
  end

  def show
    @app = App.find_by!(uid: params[:id])
  end

  def create
    cmd = Apps::CreateCommand.new(app_params)
    if cmd.execute
      flash[:info] = 'Application created'
      redirect_to apps_path
    else
      flash[:error] = cmd.errors
      render :new, status: 400
    end
  end

  def update
    @app = App.find_by!(uid: params[:id])
    cmd = Apps::UpdateStagesCommand.new(app_params.merge(id: @app.uid))
    if cmd.execute
      flash.now[:info] = 'Application updated'
      render :edit
    else
      flash.now[:error] = cmd.errors
      render :edit, status: 400
    end
  end

  def destroy
    cmd = Apps::DeleteCommand.new(uid: params[:id])
    if cmd.execute
      flash[:info] = 'Application removed'
      redirect_to app_path(params[:id])
    else
      flash[:error] = cmd.errors
      render :edit, status: 400
    end
  end

  private

  def parse_params(set)
    set[:stages] = (JSON.parse(set[:stages]) || {}).map(&:symbolize_keys) if set[:stages]
    set
  end

  def app_params
    @app_params = parse_params(params.require(:app).permit!.to_h)
  end

end
